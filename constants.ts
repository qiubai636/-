
import { CategoryId, GameProvider } from "./types";
import { 
  Trophy, MonitorPlay, Dices, Gamepad2, Ticket, 
  Cpu, Fish
} from "lucide-react";

export const WALLET_ADDRESS_TRC20 = "T9yD14Nj9j7xAB4dbGeMz4h8q...TRC20";
export const WALLET_ADDRESS_BEP20 = "0x71C7656EC7ab88b098defB751...BEP20";

export const CATEGORIES = [
  { id: CategoryId.SPORTS, name: "体育", icon: Trophy },
  { id: CategoryId.LIVE, name: "真人", icon: MonitorPlay },
  { id: CategoryId.CARDS, name: "棋牌", icon: Dices },
  { id: CategoryId.ESPORTS, name: "电竞", icon: Gamepad2 },
  { id: CategoryId.LOTTERY, name: "彩票", icon: Ticket },
  { id: CategoryId.SLOTS, name: "电子", icon: Cpu },
  { id: CategoryId.FISHING, name: "娱乐", icon: Fish },
];

export const GAME_PROVIDERS: GameProvider[] = [
  {
    id: "ayx_sports",
    name: "爱游戏体育",
    category: CategoryId.SPORTS,
    image: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=800&auto=format&fit=crop",
    count: 3064,
    rebate: "1.18%"
  },
  {
    id: "panda_sports",
    name: "熊猫体育",
    category: CategoryId.SPORTS,
    image: "https://images.unsplash.com/photo-1522770179533-24471fcdba45?q=80&w=800&auto=format&fit=crop",
    count: 2700,
    rebate: "1.18%"
  },
  {
    id: "im_sports",
    name: "IM体育",
    category: CategoryId.SPORTS,
    image: "https://images.unsplash.com/photo-1519861531473-9200263931a2?q=80&w=800&auto=format&fit=crop",
    count: 2327,
    rebate: "1.18%"
  },
  {
    id: "ayx_live",
    name: "爱游戏真人",
    category: CategoryId.LIVE,
    image: "https://images.unsplash.com/photo-1605870445919-838d190e8e1e?q=80&w=800&auto=format&fit=crop",
    count: 268,
    rebate: "1.00%"
  },
  {
    id: "db_live",
    name: "DB真人",
    category: CategoryId.LIVE,
    image: "https://images.unsplash.com/photo-1596838132731-3301c3fd4317?q=80&w=800&auto=format&fit=crop",
    count: 256,
    rebate: "1.00%"
  },
  {
    id: "ayx_esports",
    name: "爱游戏电竞",
    category: CategoryId.ESPORTS,
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800&auto=format&fit=crop",
    count: 65,
    rebate: "1.10%"
  },
  {
    id: "ayx_cards",
    name: "爱游戏棋牌",
    category: CategoryId.CARDS,
    image: "https://images.unsplash.com/photo-1628257994319-56a676823460?q=80&w=800&auto=format&fit=crop",
    count: 32,
    rebate: "1.20%"
  },
  {
    id: "ayx_slots",
    name: "爱游戏电子",
    category: CategoryId.SLOTS,
    image: "https://images.unsplash.com/photo-1518623489648-a173ef7824f3?q=80&w=800&auto=format&fit=crop",
    count: 473,
    rebate: "1.20%"
  },
  {
    id: "ayx_fishing",
    name: "爱游戏捕鱼",
    category: CategoryId.FISHING,
    image: "https://images.unsplash.com/photo-1524704654690-b56c05c78a00?q=80&w=800&auto=format&fit=crop",
    count: 18,
    rebate: "0.40%"
  }
];