## 项目描述

## 准备工作
1. 准备UI界面
2. 准备项目搭建，项目用到：
  + `react`
  + `react-redux`
  + `react-router`
  + `Ant-design`
  + 其他小插件，如随机数插件`number-random`、部署项目插件`gh-pages`

## 级联组件的制作封装
> 考虑做一个类似数字密码锁样式的滚筒UI，做法如下：
1. 视窗确定：
  + 使用`card`作为视图窗口，定位两根横线，横线中间的信息为选择项
  + 视窗分为两侧，左侧为一级选择器，右侧为二级选择器
2. 3D视图参数
  + `perspective`取400px，滚筒设定为最多显示5个数据，每个数据的角度差值为`30deg`，因此角度区间取值为`[-60°,60°]`
  + 每次滚动时，滚动角度为30°
3. 传入传出数据
  + 传入API为：obj
  + 传入数据考虑为对象，键名为一级选择器选项，值为一个数组，为二级选择器选项
  + 收到传入数据时，首先遍历数据对象，取出键并放入一个数组中，该数组前端有两个空元素，该数组用于填充选择器的左端
  + 考虑用两个`selected`开头的标识，也可以视为指针，来辅助指向选中的一、二级信息位于数组的位置，同时为选择器指出渲染的起始位置
  + 传出数据用数组形式，第一个元素为一级选择器内容，第二个为二级选择器内容
4. 动画实现，采用纯css实现
  + 因为用纯CSS实现的滚动效果，因此该版本无拖动滚动事件，考虑之后添加
  + 目前选择器有四个区域可以点击，分别控制一二级选择器进行上下滑动选择
  + 事件通过传入一个`ref`和`滚动事件`(上滚、下滚)，为目标选择器添加一个带动画的`className`，在动画结束后删除类名、更新选择器并渲染，**且为了防止同组件间的相互干扰**，**因此需要将selected放到state中**
  + 因为采用css动画，为了能在动画结束并删除后，正确显示选中的选项，需要进行更新`state`，设定一个函数`edit`，用于更新`selected`指针，更新完后并用副作用函数提供的方法`setState({...state})`更新一下组件
  + 然后就出现了**无限循环渲染**问题，因为`edit`还有个作用是更新完`selected`后，会将新的渲染数组包装成h5标签并给组件`render`，因此我在组件的初始化中便调用了该函数，于是乎初始化→更新→更新……停不下来
  + 在`edit`中加入一个条件，当传入第一个参数为0时，跳过更新渲染，直接返回当前指针指定的数组标签族，当为1时，对应选择器的`selected+1`、选择器上翻并且渲染更新，于是跳出了无限循环渲染
5. 数据处理
  + 对传入的`props`设置为该组件的`state`，并且给予对应的`setState`，取出键名作为一级选择器选项
  + 初次渲染和每次更新渲染时，用`useEffect`将选择器选中项，以数组的形式传给父组件
    +  然后，又出现了死循环，原因是通过`useEffect`向父组件传值，父组件更新连带着该组件`useEffect`被触发，从而陷入了循环

## 计算器封装
1. UI考虑
  + 考虑到是iPad端，需要有按键反馈提升用户体验，按钮不能“一按不起”，用3d摁下动作复杂、风格不符且性价比低，因此通过摁下抬起时的阴影变化提升反馈体验
  + 按钮最好不要颜色单一，功能键颜色需要突出，且单一按键最好加上渐变色
2. 实现
  + 通过组件最外层放一个事件委托，获取点击的按钮的目标值
  + 用一个数组接到目标值，设置一个**扳手**
    + 扳手的作用是每当数组中有一个运算符，便+1，或数组中传入了一个`=`时，便变成2
    + **一旦扳手的值为2时，计算器运行计算**
    + 同时扳手也是判断计算器显示=（运算）或ok（退出计算器）的标识，所以扳手放在组件state中
3. 功能细节
  + 不止可以通过`=`进行计算，两个`+`或两个`-`或一样一个都可以进行运算，不过此时将会根据第一个运算符号，进行自加/自减
  + 小数点不能在一个数字中出现两次，因此需要一个标记flag控制，当进入下一个数字的输入时，才再次放开控制，下一次输入数字的情况有：
    + 点击`C + - =`
  + 因为开启了严格模式，这个组件也是通过eval形式进行运算的，所以**要防止0开头的数字被认为是八进制**，从而报错，所以要在每一个运算数字输入前对`0`的输入进行控制
  + `OK`不仅承担了关闭计算器的功能，还需要调用函数向父组件传值
4. 接口API: initialNum={state.count} closeCalcu={closeCalcu} outPut={outPut}
  + `initialNum`负责从父组件获得一个初始值并作为初始值展示，不传值默认为0，类型： Number
  + `closeCalcu`点击`ok`后调用的函数，类型： Function
  + `outPut`每次运算获得数值后调用的函数，函数携带结果，用于向父组件传值，类型： Function

## 流水页面
1. 考虑
## 传值记录
1. `useContext`传值：
  + 单纯用于传值和传递动画函数（Pay页面和IndexPage页面），不用`action reducer`修改的值
  + 设置了全局context，在`src`中生成了一个`globalContext`文件
  + 
2. `react-redux`传值：
  + 用于创建、保存、编辑、删除、查询、分类、排名等用
  + 文件分为store、constant、actions、reducers
  + constant最简单，用于存名，标记每个名作用是干什么
  + store用于分发组件的actions到reducers进行处理，以及将处理完的数据返还给组件
  + actions分为type和data，每一次dispatch都要传递一个type（告诉store交给哪个reducer处理）和一个data（处理啥数据）
  + 所有的reducers都会收到store的分发，但是它们会根据type决定是不是自己需要处理的数据，不是则返回上一次处理的数据（preState）或干脆返回一个null
  + reducers必须返回一个值
  + 组件分为容器组件和UI组件，容器组件从actions拿到操作方法，负责和store交互，包括操作数据、传收值，再将数据传给UI组件
  + 在根组件用Provider包裹，并传入store

## 思考
1. 项目色调为橘色和暗黄色
2. 风格偏向于卡片化+横条化，记账清晰明了，这样也有利于组件封装与复用的实现
3. 记账的数据应进行分类，考虑有：
  + 收入支出分类，属性为`pay: true(支出)/false(收入)`，**必需属性**
  + 账户分类，属性为`account: String`，**必需属性**
  + 日期分类，属性为`date: Number`，**必需属性**
  + id分类，属性为`id: Number`，用于查具体某一单，**必需属性**
  + 项目分类，属性为`category: ['一级选择器','二级选择器']`，**必需属性**
  + 金额分类，属性为`count: Number`，**必需属性**
  + 备注，属性为`remark: String`
  + 成员，属性为`member: String`
4. 根据分类，在查询`countData`时应做提交相应查询条件对象，每个分类的键值对结构应为：
  + 收入支出分类`pay:Boolean`
  + 账户分类`account: String`
  + 日期分类`date:[Number,Number]`
  + id分类`id:Number`
  + 项目分类`category:['一级选择器'[,'二级选择器']]`
  + 金额分类`count: [Number,Number]`
  + 成员`member:String`
5. 发起查询动作时，一并要提供一个查询对象，其中包含两个值，一是查询范围`list(component可以提供String、Array类型数据，但在reducer逻辑中时，数据结构为Array)`，一是查询条件`demand(从始至终数据结构为Object)`
6. 查询reducer接收到action时，会根据条件的键值对中，值的数据类型进行分类查询：
  + 比如`category count date`是引用数据类型，其他的是基本数据类型
  + 基本数据类型要求是精准匹配，匹配逻辑是一样的，所以不用做区分，符合`demand[key]=list[key]`就通过
  + 数组结构的条件，是范围查询用的，当两端取值一样时，便成了精准查值了
  + 数组结构中也分两类，一类是`category`可以查一级选择器或查到二级选择器，一类是`date count`用于范围查找的，尤其是date，基本不能查到具体时间点的账单
  + > 综上，按照查询条件中的数据结构，将查询逻辑分三类:精准查找`pay id member account`、分级查找`category`、范围查找`date count`
7. `list`查询范围可以根据传入的信息，找出相关范围的数组交给reducer按demand进行查找
  + `list`的值可以为`all today week month`关键字，分别是以`所有 今天 这周 这月`的账单为范围
  + 也可以传入一个带着date数据的数组，以数组中时间内的账单为范围
8. 排名reducer需求数据同上，接收到需要排名的`list demand`,返回一个符合需求的数组，数组符合`demand`要求
  + `demand`中自带一个`order`属性，为空或者为`false`默认为降序
  + 如果出现多个数据同级，则再按照时间顺序，从近到远排序
9. 修改账单与添加账单同reducer
## 问题记录
1. 在antd的card组件中设置一个浮动组件，会出现被外面的组件占掉位置的情况
  + 推测是提供的组件没有触发BFC，通过给card组件设置overflow:hidden解决问题
2. key值的设置不能为`Math.random()`，引入随机数小插件解决问题
3. 设置BrowserRouter在github上刷新动作会出现404，因为域名是博客页面，因此用HashRouter
  + 当前页面只有一个params值，因此想要在同一个页面，通过params进入不同路由，需要go（-1）返回第一次通过params跳转的页面，有个不能省略的注释标记在代码中