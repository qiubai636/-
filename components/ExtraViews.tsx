
import React, { useState } from 'react';
import { ViewProps } from '../types';
import { Gift, Headset, Shield, ChevronRight, MessageSquare, Phone, Mail, ExternalLink, ChevronDown } from 'lucide-react';

export const PromoView: React.FC<ViewProps> = () => (
    <div className="h-full bg-slate-100 flex flex-col pb-24 pt-safe">
        <div className="bg-white px-4 py-3 border-b border-slate-100 shadow-sm shrink-0">
            <h2 className="font-bold text-lg text-center">优惠活动</h2>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {[
                { title: "首存红利 100%", sub: "最高可得 500 USDT", color: "from-blue-500 to-cyan-500" },
                { title: "体育救援金", sub: "周周返利高达 8888 USDT", color: "from-amber-500 to-yellow-500" },
                { title: "VIP 专属特权", sub: "升级礼金与生日红包", color: "from-purple-600 to-pink-600" },
                { title: "好友邀请", sub: "邀请好友各得 50 USDT", color: "from-green-500 to-emerald-600" },
            ].map((promo, i) => (
                <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm group">
                    <div className={`h-32 bg-gradient-to-r ${promo.color} relative p-6 flex flex-col justify-center`}>
                        <div className="absolute right-0 top-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl"></div>
                        <h3 className="text-white font-black text-2xl relative z-10 italic">{promo.title}</h3>
                        <p className="text-white/90 text-sm font-medium relative z-10 mt-1">{promo.sub}</p>
                    </div>
                    <div className="p-4 flex justify-between items-center">
                        <span className="text-xs text-slate-400 font-medium">长期活动</span>
                        <button className="text-amber-600 text-xs font-bold flex items-center gap-1">
                            查看详情 <ChevronRight size={14} />
                        </button>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

export const SupportView: React.FC<ViewProps> = ({ onOpenChat }) => {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    const questions = [
        { 
            q: "如何进行充值？", 
            a: "点击首页或个人中心的‘充值’按钮，选择充值网络（TRC20或BEP20），复制显示的钱包地址，使用您的数字钱包向该地址转账即可。链上确认通常 3-5 分钟内到账。" 
        },
        { 
            q: "提现需要多久到账？", 
            a: "提现申请提交后，系统会自动进行风控审核。小额提现（5000 USDT以下）通常在 10-15 分钟内自动到账；大额提现可能需要人工审核，预计 1-2 小时内完成。" 
        },
        { 
            q: "如何修改登录密码？", 
            a: "进入‘我的’页面，点击右上角的‘安全中心’图标，选择‘登录密码’ - ‘修改’，按提示输入旧密码和新密码即可完成修改。为了账户安全，建议定期更换密码。" 
        },
        { 
            q: "忘记账号怎么办？", 
            a: "如果您忘记了账号，请点击登录页面的‘在线客服’或点击本页面的‘电话回拨’功能，提供您注册时的手机号或邮箱，客服人员将协助您找回账号。" 
        }
    ];

    return (
        <div className="h-full bg-slate-100 flex flex-col pb-24 pt-safe">
            <div className="bg-white px-4 py-3 border-b border-slate-100 shadow-sm shrink-0">
                 <h2 className="font-bold text-lg text-center">客户服务</h2>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
                <div className="bg-white rounded-2xl p-6 text-center mb-6 shadow-sm">
                    <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Headset size={32} />
                    </div>
                    <h3 className="font-bold text-slate-800 text-lg mb-2">需要帮助吗？</h3>
                    <p className="text-slate-500 text-sm mb-6">我们的专业客服团队 24/7 全天候为您服务</p>
                    <div className="grid grid-cols-2 gap-4">
                        <button 
                            onClick={onOpenChat}
                            className="py-3 rounded-xl bg-amber-500 text-white font-bold text-sm shadow-lg shadow-amber-500/30 active:scale-95 transition-transform flex items-center justify-center gap-2 hover:bg-amber-600"
                        >
                            <MessageSquare size={18} /> 在线客服
                        </button>
                        <button 
                            onClick={() => alert("客服人员将稍后回拨您的注册电话，请保持通话畅通。")}
                            className="py-3 rounded-xl bg-slate-100 text-slate-700 font-bold text-sm hover:bg-slate-200 transition-colors flex items-center justify-center gap-2"
                        >
                            <Phone size={18} /> 电话回拨
                        </button>
                    </div>
                </div>

                <h4 className="font-bold text-slate-700 mb-3 ml-1 flex items-center gap-2">
                    <span className="w-1 h-4 bg-amber-500 rounded-full"></span> 常见问题
                </h4>
                <div className="space-y-2">
                    {questions.map((item, i) => (
                        <div key={i} className="bg-white rounded-xl overflow-hidden shadow-sm transition-all border border-slate-50">
                            <button 
                                onClick={() => setActiveIndex(activeIndex === i ? null : i)}
                                className="w-full p-4 flex justify-between items-center text-left hover:bg-slate-50 transition-colors"
                            >
                                <span className={`text-sm font-medium transition-colors ${activeIndex === i ? 'text-amber-600 font-bold' : 'text-slate-600'}`}>
                                    {item.q}
                                </span>
                                <div className={`transition-transform duration-300 ${activeIndex === i ? 'rotate-180 text-amber-500' : 'text-slate-300'}`}>
                                    {activeIndex === i ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                                </div>
                            </button>
                            {activeIndex === i && (
                                <div className="px-4 pb-4 animate-in slide-in-from-top-2">
                                    <div className="h-px w-full bg-slate-50 mb-3"></div>
                                    <p className="text-xs text-slate-500 leading-relaxed bg-slate-50 p-3 rounded-lg">
                                        {item.a}
                                    </p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
                
                 <div className="mt-8 text-center">
                    <p className="text-xs text-slate-400">客服邮箱</p>
                    <p className="text-sm font-bold text-slate-600 flex items-center justify-center gap-2 mt-1 hover:text-amber-600 cursor-pointer transition-colors">
                        <Mail size={14}/> support@ayx.com
                    </p>
                </div>
            </div>
        </div>
    );
};

export const SponsorshipView: React.FC<ViewProps> = () => (
    <div className="h-full bg-slate-100 flex flex-col pb-24 pt-safe">
         <div className="bg-white px-4 py-3 border-b border-slate-100 shadow-sm shrink-0">
             <h2 className="font-bold text-lg text-center">品牌赞助</h2>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
             <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
                 <img src="https://images.unsplash.com/photo-1522778119026-d647f0565c6a?q=80&w=800&auto=format&fit=crop" className="w-full h-48 object-cover" alt="Stadium"/>
                 <div className="p-5">
                     <div className="flex items-center gap-3 mb-3">
                         <img src="https://upload.wikimedia.org/wikipedia/en/thumb/5/56/Newcastle_United_Logo.svg/1200px-Newcastle_United_Logo.svg.png" className="h-10 w-10 object-contain" alt="Logo"/>
                         <div>
                             <h3 className="font-bold text-slate-800">纽卡斯尔联足球俱乐部</h3>
                             <p className="text-xs text-slate-400">官方球衣赞助商 (2023-2025)</p>
                         </div>
                     </div>
                     <p className="text-sm text-slate-600 leading-relaxed">
                         爱游戏(AYX)与英超豪门纽卡斯尔联正式达成战略合作伙伴关系，双方将致力于为全球球迷提供更优质的体育娱乐体验。
                     </p>
                 </div>
             </div>

             <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
                 <img src="https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?q=80&w=800&auto=format&fit=crop" className="w-full h-48 object-cover" alt="Football"/>
                 <div className="p-5">
                     <div className="flex items-center gap-3 mb-3">
                         <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Borussia_M%C3%B6nchengladbach_logo.svg/1200px-Borussia_M%C3%B6nchengladbach_logo.svg.png" className="h-10 w-10 object-contain" alt="Logo"/>
                         <div>
                             <h3 className="font-bold text-slate-800">门兴格拉德巴赫</h3>
                             <p className="text-xs text-slate-400">亚洲区域官方合作伙伴</p>
                         </div>
                     </div>
                     <p className="text-sm text-slate-600 leading-relaxed">
                         携手德甲劲旅，共同开拓亚洲市场，展现体育精神与激情。
                     </p>
                 </div>
             </div>
             
             <button className="w-full py-3 text-slate-400 text-xs font-medium flex items-center justify-center gap-1">
                 查看更多合作详情 <ExternalLink size={12}/>
             </button>
        </div>
    </div>
);
