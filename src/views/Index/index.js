import { defineComponent } from 'vue';

// 接口请求数据
const data = [
    { type: 1, name: '远程支持', desc: '可获得活动PPT等资料', price: 9.99, stock: 99 },
    { type: 2, name: '赞助商', desc: '获得品牌露出机会，详情联系...', price: 9.99, stock: 2 },
    { type: 3, name: '标准', desc: '可获得活动现场参加活动的机会', price: 0.99, stock: 99 }
];

export default defineComponent({
    name: 'Index',
    data() {
        return {
            tickets: [],
            ticketBuyer: {
                phone: '',
                email: '',
            }
        }
    },
    computed: {
        totalCount() {
            let { tickets } = this;
            let count = 0;
            tickets.forEach(item => {
                count += item.count;
            });
            return count;
        },
        totalPrice() {
            let { tickets } = this;
            let price = 0;
            tickets.forEach(item => {
                price += item.count * item.price;
            });
            price = price.toFixed(2);
            let priceList = price.split('.');
            let yuan = priceList[0];
            let fen = priceList[1];
            return {
                yuan,
                fen
            };
        }
    },
    mounted() {
        this.init();
    },
    methods: {
        // 初始化
        init() {
            this.tickets = data.map(item => {
                let priceList = String(item.price).split('.');
                item.yuan = Number(priceList[0]);
                item.fen = Number(priceList[1]);
                item.peopleList = [];
                item.count = 0;
                return item;
            });
        },
        // 增加/减少票数
        handleOpt(index, type) {
            let { tickets } = this;
            let ticket = tickets[index];
            if (type === 'decrease') {
                if (ticket.count === 0) return;
                ticket.count -= 1;
                ticket.peopleList.pop();
            } else if (type === 'increase') {
                if (ticket.count >= ticket.stock) return;
                ticket.count += 1;
                ticket.peopleList.push({
                    name: '',
                    code: '',
                    gender: -1
                });
            }
            this.tickets = tickets.map(item => {
                if (ticket.type === item.type) {
                    item = JSON.parse(JSON.stringify(ticket));
                }
                return item;
            });
        },
        // 输入购买者信息
        onChangeBuyer(value, type) {
            let { ticketBuyer } = this;
            ticketBuyer[type] = value;
            this.ticketBuyer = ticketBuyer;
        },
        // 输入参与者信息
        onChangeInfo(value, type, ticket, itemIndex) {
            let { tickets } = this;
            this.tickets = tickets.map(item => {
                if (ticket.type === item.type) {
                    item.peopleList[itemIndex][type] = value;
                }
                return item;
            });
        },
        // 支付
        pay() {
            let { tickets, totalPrice, totalCount, ticketBuyer } = this;
            let { yuan, fen } = totalPrice;
            let price = Number(yuan) + (Math.round(Number(fen)) / 100);
            let users = [];
            if (!totalCount || totalCount <= 0) {
                alert('您还未选择票种');
                return;
            } else if (!ticketBuyer.phone || !ticketBuyer.email) {
                alert('请输入完整的购买者信息');
                return;
            }
            for(let i = 0;i < tickets.length;i++) {
                let item = tickets[i];
                for(let j = 0;j < item.peopleList.length;j++) {
                    let people = item.peopleList[j];
                    if (!people.name || !people.code || people.gender < 0) {
                        alert(`请输入完整的参与者【"${item.name}"票】第${j + 1}位信息`);
                        return;
                    }
                    users.push({
                        type: item.type,
                        price: item.price,
                        ...people
                    });
                }
            }
            let params = {
                totalPrice: price,
                buyer: ticketBuyer,
                users: users
            }
            console.log('POST请求参数', params);
        }
    }
});