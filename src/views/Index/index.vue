<template>
    <div class="wrapper">
        <div class="box">
            <div class="label">选择票种</div>
            <div class="ticket-cells">
                <div
                    v-for="(item, index) in tickets"
                    :key="'ticket_' + index"
                    class="ticket-cell"
                >
                    <div class="l">
                        <div class="name">{{item.name}}</div>
                        <div class="desc">{{item.desc}}</div>
                        <div class="price">
                            <span class="yuan">{{item.yuan || 0}}</span>
                            <span class="fen">.{{item.fen || 0}}</span>
                            <span class="unit">元</span>
                            <span v-if="item.stock < 10" class="stock">仅剩 {{item.stock}} 张</span>
                        </div>
                    </div>
                    <div class="r">
                        <div
                            class="btn"
                            :class="item.count > 0 ? 'active' : ''"
                            @click="handleOpt(index, 'decrease')"
                        >
                            <span class="icon-decrease"></span>
                        </div>
                        <div class="btn count">{{item.count}}</div>
                        <div
                            class="btn"
                            :class="item.count < item.stock ? 'active' : ''"
                            @click="handleOpt(index, 'increase')"
                        >
                            <span class="icon-increase"></span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="box">
            <div class="label">购票人信息</div>
            <div class="form">
                <div class="form-cell">
                    <div class="form-label">手机号</div>
                    <input
                        type="number"
                        class="form-value"
                        placeholder="请输入您的手机号，将用于接收出票短信"
                        @input="(e) => { onChangeBuyer(e.target.value, 'phone') }"
                    />
                </div>
                <div class="form-cell">
                    <div class="form-label">电子邮箱</div>
                    <input
                        type="email"
                        class="form-value"
                        placeholder="请输入您的电子邮箱，将用于接收出票邮件"
                        @input="(e) => { onChangeBuyer(e.target.value, 'email') }"
                    />
                </div>
            </div>
        </div>
        <template
            v-for="ticket in tickets"
            :key="'ticket_people_' + ticket.type"
        >
            <div
                v-for="(item, index) in ticket.peopleList"
                :key="'people_' + ticket.type + '_' + index"
                class="box"
            >
                <div class="label">
                    参与者信息（“{{ticket.name}}”票第 {{index + 1}} 位）
                </div>
                <div class="form">
                    <div class="form-cell">
                        <div class="form-label">姓名</div>
                        <input
                            class="form-value"
                            type="text"
                            :value="item.name"
                            placeholder="请输入您的真实姓名"
                            @input="(e) => { onChangeInfo(e.target.value, 'name', ticket, index) }"
                        />
                    </div>
                    <div class="form-cell">
                        <div class="form-label">身份证号</div>
                        <input
                            class="form-value"
                            type="text"
                            :value="item.code"
                            placeholder="由于现场安保需要，请输入您的身份证号"
                            @input="(e) => { onChangeInfo(e.target.value, 'code', ticket, index) }"
                        />
                    </div>
                    <div class="form-cell">
                        <div class="form-label">性别</div>
                        <div class="gender-cells">
                            <div
                                class="gender-cell"
                                @click="onChangeInfo(1, 'gender', ticket, index)"
                            >
                                <span class="icon-select" :class="item.gender == 1 ? 'active' : ''"></span>
                                <span>男性</span>
                            </div>
                            <div
                                class="gender-cell"
                                @click="onChangeInfo(2, 'gender', ticket, index)"
                            >
                                <span class="icon-select" :class="item.gender == 2 ? 'active' : ''"></span>
                                <span>女性</span>
                            </div>
                            <div
                                class="gender-cell"
                                @click="onChangeInfo(3, 'gender', ticket, index)"
                            >
                                <span class="icon-select" :class="item.gender == 3 ? 'active' : ''"></span>
                                <span>其他</span>
                            </div>
                            <div
                                class="gender-cell"
                                @click="onChangeInfo(0, 'gender', ticket, index)"
                            >
                                <span class="icon-select" :class="item.gender == 0 ? 'active' : ''"></span>
                                <span>不愿透露</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </template>
        <div class="footer">
            <div class="footer-l">
                <div class="total">
                    <span>共</span>
                    <span class="count">{{totalCount}}</span>
                    <span>张票</span>
                </div>
                <div class="price">
                    <span>合计</span>
                    <span class="yuan">{{totalPrice.yuan}}</span>
                    <span class="fen">.{{totalPrice.fen}}</span>
                    <span>元</span>
                </div>
            </div>
            <div
                class="btn-pay"
                @click="pay"
            >立即支付</div>
        </div>
    </div>
</template>

<script
    src="./index.js"
>
</script>

<style
    lang="scss"
    scoped
    src="./index.scss"
>
</style>