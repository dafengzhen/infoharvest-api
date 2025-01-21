import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

import { AuthService } from '../auth/auth.service';
import { Collection } from '../collection/entities/collection.entity';
import { EXP_DAYS } from '../constants';
import { ExcerptLink } from '../excerpt/entities/excerpt-link.entity';
import { ExcerptName } from '../excerpt/entities/excerpt-name.entity';
import { ExcerptState } from '../excerpt/entities/excerpt-state.entity';
import { Excerpt } from '../excerpt/entities/excerpt.entity';
import { History } from '../history/entities/history.entity';
import { CountByDateDto } from './dto/count-by-date.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateCustomizationSettingsUserDto } from './dto/update-customization-settings-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CustomizationSettings } from './entities/customization-settings';
import { User } from './entities/user.entity';
import { TokenVo } from './vo/token.vo';

/**
 * UserService,
 *
 * @author dafengzhen
 */
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Collection)
    private readonly collectionRepository: Repository<Collection>,
    @InjectRepository(Excerpt)
    private readonly excerptRepository: Repository<Excerpt>,
    @InjectRepository(ExcerptName)
    private readonly excerptNameRepository: Repository<ExcerptName>,
    @InjectRepository(ExcerptLink)
    private readonly excerptLinkRepository: Repository<ExcerptLink>,
    @InjectRepository(ExcerptState)
    private readonly excerptStateRepository: Repository<ExcerptState>,
    @InjectRepository(History)
    private readonly historyRepository: Repository<History>,
    private readonly authService: AuthService,
    private readonly dataSource: DataSource,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const username = createUserDto.username;
    const password = createUserDto.password;

    if (
      await this.userRepository.exists({
        where: { username },
      })
    ) {
      throw new BadRequestException('The user already exists, creation failed');
    }

    const user = await this.userRepository.save(
      new User({
        password: await this.authService.encryptPassword(password),
        username,
      }),
    );

    return new TokenVo({
      expDays: EXP_DAYS,
      id: user.id,
      token: this.authService.getTokenForUser(user),
      username: user.username,
    });
  }

  async createExampleUser() {
    const username = 'root';
    const password = '123456';

    if (
      await this.userRepository.exists({
        where: {
          username,
        },
      })
    ) {
      // 示例用户已存在数据库中，无法被再次创建
      throw new BadRequestException('The example user already exists in the database and cannot be created again');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const savedUser = await this.userRepository.save(
        new User({
          example: true,
          password: await this.authService.encryptPassword(password),
          username,
        }),
      );

      const data = this.getExampleData();
      for (let i = 0; i < data.length; i++) {
        const item = data[i];
        const collection = new Collection({ name: item.name });
        collection.user = savedUser;
        collection.subset = item.subset.map((value) => {
          const _subset = new Collection({ name: value.name });
          _subset.user = savedUser;
          _subset.excerpts = value.excerpts.map((excerpt) => {
            const _excerpt = new Excerpt();
            _excerpt.user = savedUser;
            _excerpt.names = excerpt.names.map((_name) => new ExcerptName({ name: _name }));
            _excerpt.links = excerpt.links.map((_link) => new ExcerptLink({ link: _link }));
            _excerpt.description = excerpt.description;
            return _excerpt;
          });
          return _subset;
        });
        await this.collectionRepository.save(collection);
      }

      await queryRunner.commitTransaction();
    } catch (e) {
      await queryRunner.rollbackTransaction();
      throw e;
    } finally {
      await queryRunner.release();
    }

    return {
      example: true,
      password,
      username,
    };
  }

  async findOne(id: number, user: User) {
    this.checkIfUserIsOwner(id, user);
    return this.userRepository.findOneByOrFail({
      id,
    });
  }

  async getProfile(user: null | User) {
    if (user) {
      return this.userRepository.findOneByOrFail({
        id: user.id,
      });
    }
  }

  async getUsersCountByDate(dto: CountByDateDto): Promise<
    {
      count: number;
      date: string;
    }[]
  > {
    const pastDays = dto.pastDays ?? 15;
    const today = new Date();
    const pastDate = new Date(today.getTime() - pastDays * 24 * 60 * 60 * 1000);
    return this.userRepository
      .createQueryBuilder()
      .select('DATE(create_date)', 'date')
      .addSelect('COUNT(id)', 'count')
      .where('create_date >= :startDate AND create_date <= :endDate', {
        endDate: today.toISOString(),
        startDate: pastDate.toISOString(),
      })
      .groupBy('DATE(create_date)')
      .getRawMany();
  }

  async remove(currentUser: User) {
    const id = currentUser.id;
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const user = await this.userRepository.findOneOrFail({
        relations: {
          collections: {
            subset: true,
          },
          excerpts: {
            links: true,
            names: true,
            states: true,
          },
          histories: true,
        },
        where: { id },
      });

      // histories
      await this.historyRepository.remove(user.histories);

      // excerpts
      const excerpts = user.excerpts;
      for (let i = 0; i < excerpts.length; i++) {
        const excerpt = excerpts[i];
        await this.excerptNameRepository.remove(excerpt.names);
        await this.excerptLinkRepository.remove(excerpt.links);
        await this.excerptStateRepository.remove(excerpt.states);
      }
      await this.excerptRepository.remove(excerpts);

      // collections
      const collections = user.collections;
      for (let i = 0; i < collections.length; i++) {
        const collection = collections[i];
        await this.collectionRepository.remove(collection.subset);
      }
      await this.collectionRepository.remove(collections);

      // user
      await this.userRepository.remove(user);
      await queryRunner.commitTransaction();
    } catch (e) {
      await queryRunner.rollbackTransaction();
      throw e;
    } finally {
      await queryRunner.release();
    }
  }

  async update(id: number, currentUser: User, updateUserDto: UpdateUserDto) {
    this.checkIfUserIsOwner(id, currentUser);
    const user = await this.userRepository.findOneByOrFail({
      id,
    });

    const username = updateUserDto.username;
    if (typeof username === 'string' && username !== user.username) {
      if (
        await this.userRepository.exists({
          where: { username },
        })
      ) {
        throw new BadRequestException('Username already exists, please consider choosing a different name');
      }

      if (user.username === 'root') {
        throw new BadRequestException('Sorry, it is not possible to change the username for the example user');
      }

      user.username = username;
    }

    const oldPassword = updateUserDto.oldPassword;
    const newPassword = updateUserDto.newPassword;
    if (
      typeof oldPassword === 'string' &&
      typeof newPassword === 'string' &&
      oldPassword.trim() !== '' &&
      newPassword.trim() !== ''
    ) {
      if (!(await AuthService.isMatchPassword(oldPassword, user.password))) {
        throw new BadRequestException('Sorry, the old password verification failed');
      }

      user.password = await this.authService.encryptPassword(newPassword);
    }

    user.avatar = updateUserDto.avatar;

    await this.userRepository.save(user);
  }

  async updateCustomizationSettings(
    id: number,
    currentUser: User,
    updateCustomizationSettingsUserDto: UpdateCustomizationSettingsUserDto = {},
  ) {
    this.checkIfUserIsOwner(id, currentUser);
    const user = await this.userRepository.findOneByOrFail({
      id,
    });

    const { wallpaper } = updateCustomizationSettingsUserDto;

    if (typeof user.customizationSettings !== 'object') {
      user.customizationSettings = new CustomizationSettings();
    }

    if (typeof wallpaper === 'string') {
      user.customizationSettings.wallpaper = wallpaper.trim();
    }

    await this.userRepository.save(user);
  }

  private checkIfUserIsOwner(id: number, user: User) {
    if (id !== user.id) {
      throw new ForbiddenException(
        "Apologies, not the user themselves, lacking permission to access the user's resources",
      );
    }
  }

  private getExampleData() {
    return [
      {
        name: '电影',
        subset: [
          {
            excerpts: [
              {
                description: '王宝强冲破命运牢笼',
                links: ['https://www.example.com'],
                names: ['八角笼中'],
              },
              {
                description: '开启缤纷元素城奇妙冒险！',
                links: ['https://www.example.com'],
                names: ['疯狂元素城'],
              },
              {
                description: '古天乐刘青云郭富城抢毒！',
                links: ['https://www.example.com'],
                names: ['扫毒 3：人在天涯'],
              },
              {
                description: '梁朝伟王一博生死谍战！',
                links: ['https://www.example.com'],
                names: ['无名'],
              },
              {
                description: '沈腾千玺演绎热血忠义！',
                links: ['https://www.example.com'],
                names: ['满江红'],
              },
              {
                description: '发哥情迷女生之作！',
                links: ['https://www.example.com'],
                names: ['赌神'],
              },
              {
                description: '王一博胡军周冬雨戎装亮相！',
                links: ['https://www.example.com'],
                names: ['长空之王'],
              },
              {
                description: '新海诚口碑票房双爆神作！',
                links: ['https://www.example.com'],
                names: ['你的名字'],
              },
            ],
            name: '剧情',
          },
          {
            excerpts: [
              {
                description: '艾伦沈腾爆笑重聚',
                links: ['https://www.example.com'],
                names: ['超能一家人'],
              },
              {
                description: '华仔星爷联手驰骋赌博界！',
                links: ['https://www.example.com'],
                names: ['赌侠'],
              },
              {
                description: '韩庚郑恺“双贱合璧”',
                links: ['https://www.example.com'],
                names: ['前任 3：再见前任'],
              },
              {
                description: '帅气！星爷大战斧头帮',
                links: ['https://www.example.com'],
                names: ['功夫'],
              },
              {
                description: '周星驰大展骂功斗恶霸',
                links: ['https://www.example.com'],
                names: ['九品芝麻官'],
              },
              {
                description: '经典才子佳人爱情故事',
                links: ['https://www.example.com'],
                names: ['唐伯虎点秋香'],
              },
              {
                description: '沈腾搞怪笑skr人',
                links: ['https://www.example.com'],
                names: ['西虹市首富'],
              },
              {
                description: '雷佳音张小斐变欢喜冤家',
                links: ['https://www.example.com'],
                names: ['交换人生'],
              },
            ],
            name: '喜剧',
          },
          {
            excerpts: [
              {
                description: '乌尔善再导魔幻巨制',
                links: ['https://www.example.com'],
                names: ['封神第一部：朝歌风云'],
              },
              {
                description: '斯坦森吴京双雄联手战巨鲨',
                links: ['https://www.example.com'],
                names: ['巨齿鲨2：深渊'],
              },
              {
                description: '卡神巨制！影史票房第一',
                links: ['https://www.example.com'],
                names: ['阿凡达'],
              },
              {
                description: '猛兽侠、擎天柱强强对决',
                links: ['https://www.example.com'],
                names: ['变形金刚：超能勇士崛起'],
              },
              {
                description: '阿汤哥飞车跳崖千米伞降',
                links: ['https://www.example.com'],
                names: ['碟中谍 7：致命清算（上）'],
              },
              {
                description: '速激系列终章燃炸肾上腺',
                links: ['https://www.example.com'],
                names: ['速度与激情 10'],
              },
              {
                description: '特种部队鏖战海陆空',
                links: ['https://www.example.com'],
                names: ['红海行动'],
              },
              {
                description: '最燃国产军事片再出续集',
                links: ['https://www.example.com'],
                names: ['战狼 2'],
              },
            ],
            name: '动作',
          },
        ],
      },
      {
        name: '电视剧',
        subset: [
          {
            excerpts: [
              {
                description: '杨紫极致虐恋修罗场',
                links: ['https://www.example.com'],
                names: ['长相思 第一季'],
              },
              {
                description: '肖战王一博共闯侠义江湖',
                links: ['https://www.example.com'],
                names: ['陈情令'],
              },
              {
                description: '杨洋赵露思并肩共赴天下',
                links: ['https://www.example.com'],
                names: ['且试天下'],
              },
              {
                description: '合租男女囧事多',
                links: ['https://www.example.com'],
                names: ['爱情公寓 3'],
              },
              {
                description: '杨紫开启四界追爱之旅',
                links: ['https://www.example.com'],
                names: ['香蜜沉沉烬如霜'],
              },
              {
                description: '刘亦菲陈晓共闯大宋繁华',
                links: ['https://www.example.com'],
                names: ['梦华录'],
              },
              {
                description: '景甜任嘉伦演绎乱世爱恋',
                links: ['https://www.example.com'],
                names: ['大唐荣耀'],
              },
              {
                description: '热巴吴磊热血共守家国梦',
                links: ['https://www.example.com'],
                names: ['长歌行'],
              },
            ],
            name: '爱情',
          },
          {
            excerpts: [
              {
                description: '白宇帆宁理破诡案揭人性',
                links: ['https://www.example.com'],
                names: ['繁城之下'],
              },
              {
                description: '张若昀搅动庙堂江湖',
                links: ['https://www.example.com'],
                names: ['雪中悍刀行'],
              },
              {
                description: '张若昀身陷棋局绝处逢生',
                links: ['https://www.example.com'],
                names: ['庆余年'],
              },
              {
                description: '赵丽颖冯绍峰琴瑟和鸣',
                links: ['https://www.example.com'],
                names: ['知否知否应是绿肥红瘦'],
              },
              {
                description: '孙俪演绎第一女政治家',
                links: ['https://www.example.com'],
                names: ['芈月传'],
              },
              {
                description: '陈建斌倪大红陆毅乱世争霸',
                links: ['https://www.example.com'],
                names: ['新三国'],
              },
              {
                description: '赵本山宋小宝再联手',
                links: ['https://www.example.com'],
                names: ['鹊刀门传奇'],
              },
              {
                description: '胡歌刘涛演绎惊魂权谋',
                links: ['https://www.example.com'],
                names: ['琅琊榜'],
              },
            ],
            name: '古装',
          },
          {
            excerpts: [
              {
                description: '警察师徒携手正义反诈',
                links: ['https://www.example.com'],
                names: ['反诈风暴'],
              },
              {
                description: '于和伟徐峥缉毒天团',
                links: ['https://www.example.com'],
                names: ['猎毒人'],
              },
              {
                description: '孙红雷张艺兴惩黑除恶',
                links: ['https://www.example.com'],
                names: ['扫黑风暴'],
              },
              {
                description: '元芳你怎么看',
                links: ['https://www.example.com'],
                names: ['神探狄仁杰'],
              },
              {
                description: '任嘉伦张钧甯烧脑试探',
                links: ['https://www.example.com'],
                names: ['不说再见'],
              },
              {
                description: '专案组与神秘暗黑者博弈',
                links: ['https://www.example.com'],
                names: ['暗黑者 2'],
              },
              {
                description: '韩东君陈瑶续写无心前传',
                links: ['https://www.example.com'],
                names: ['无心法师 3'],
              },
              {
                description: '林峯回归再陷卧底疑云',
                links: ['https://www.example.com'],
                names: ['使徒行者 3'],
              },
            ],
            name: '悬疑',
          },
        ],
      },
      {
        name: '动漫',
        subset: [
          {
            excerpts: [
              {
                description: '斗罗五年，璀璨终章！',
                links: ['https://www.example.com'],
                names: ['斗罗大陆'],
              },
              {
                description: '银河浩瀚，征途不止',
                links: ['https://www.example.com'],
                names: ['吞噬星空'],
              },
              {
                description: '陨落古神，遨游苍蓝',
                links: ['https://www.example.com'],
                names: ['万界神主'],
              },
              {
                description: '少年不屈 异火不熄',
                links: ['https://www.example.com'],
                names: ['斗破苍穹 第 4 季'],
              },
              {
                description: '一人之下 第2季',
                links: ['https://www.example.com'],
                names: ['一人之下 第 2 季'],
              },
              {
                description: '完结！去做你要做的事吧',
                links: ['https://www.example.com'],
                names: ['画江湖之不良人 第 4 季'],
              },
              {
                description: '会兄弟之情，夺逆央至宝',
                links: ['https://www.example.com'],
                names: ['星辰变 第 4 季'],
              },
              {
                description: '超高颜值的权谋史诗',
                links: ['https://www.example.com'],
                names: ['天行九歌 第 1 季'],
              },
            ],
            name: '冒险',
          },
          {
            excerpts: [
              {
                description: '谁来续至尊和传说？',
                links: ['https://www.example.com'],
                names: ['完美世界'],
              },
              {
                description: '深渊再起，王座降临',
                links: ['https://www.example.com'],
                names: ['神印王座'],
              },
              {
                description: '我身为剑，再续前缘',
                links: ['https://www.example.com'],
                names: ['万界独尊'],
              },
              {
                description: '重生踏足武道巅峰',
                links: ['https://www.example.com'],
                names: ['妖神记'],
              },
              {
                description: '斩断仙缘，融化思念',
                links: ['https://www.example.com'],
                names: ['万界仙踪'],
              },
              {
                description: '夷陵老祖重现人间',
                links: ['https://www.example.com'],
                names: ['魔道祖师'],
              },
              {
                description: '神力觉醒 封神演义',
                links: ['https://www.example.com'],
                names: ['武庚纪 第 4 季'],
              },
              {
                description: '荣耀不灭，兴欣归来',
                links: ['https://www.example.com'],
                names: ['全职高手'],
              },
            ],
            name: '战斗',
          },
          {
            excerpts: [
              {
                description: '永恒的柯南',
                links: ['https://www.example.com'],
                names: ['名侦探柯南'],
              },
              {
                description: '最爆笑的小男孩儿',
                links: ['https://www.example.com'],
                names: ['蜡笔小新'],
              },
              {
                description: '神奇宝贝无印篇',
                links: ['https://www.example.com'],
                names: ['精灵宝可梦'],
              },
              {
                description: '小丸子美好童真',
                links: ['https://www.example.com'],
                names: ['樱桃小丸子'],
              },
              {
                description: '天才网球少年',
                links: ['https://www.example.com'],
                names: ['网球王子'],
              },
              {
                description: '葫芦娃斗妖精',
                links: ['https://www.example.com'],
                names: ['葫芦兄弟'],
              },
              {
                description: '数风流人物，还看今朝！',
                links: ['https://www.example.com'],
                names: ['三国演义'],
              },
              {
                description: '机器猫第 3 季',
                links: ['https://www.example.com'],
                names: ['哆啦A梦'],
              },
            ],
            name: '经典',
          },
        ],
      },
    ];
  }
}
