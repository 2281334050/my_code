import React, { Component } from 'react';
import axios from 'axios';
import qs from 'qs';
import {createStore} from 'redux';
import http from './server';//封装的请求方法
import api from './libraries/api_list';//接口列表
import {
    BrowserRouter as Router,
    Route,
    NavLink,
    Redirect
} from 'react-router-dom';
import './style.less';
import PublishPictures from './PublishPictures';
import ImageData from './imageData';
import SkillData from './skillData';
const requireContext = require.context("./img",true);
const images = requireContext.keys().map(requireContext);
ImageData.map(function (item,i) {
    item.url=images[i]
});
const songEmpty = require('./img/song_empty.png');

/*页面主体*/
class App extends Component {
    constructor(props){
        super(props);
        this.state = {
            className:'hide',
            popMsg:{msg:'',status:0}/*status 0错误消息 1成功消息 */
        }
    }
    componentDidMount(){
        window.addEventListener('scroll',this.handleScroll);
    }
    componentWillUnmount(){
        window.removeEventListener('scroll',this.handleScroll)
    }
    handleScroll = (e)=>{
        let ScrollTop = document.body.scrollTop || document.documentElement.scrollTop;
        if(ScrollTop<50){
            this.setState({className:'hide'})
        }else{
            this.setState({className:''})
        }
    }
    /*全局调用会话气泡窗口*/
    popMsg = (msg_obj)=>{
        console.log(msg_obj)
        if(msg_obj){
            this.setState({
                popMsg:{msg:msg_obj.msg,status:msg_obj.status}
            })
        }
    }
  render() {
    return (
      <div className={`main`}>
        <MsgTips status={this.state.popMsg.status} popMsg={this.popMsg}  msg={this.state.popMsg.msg}/>
          <MusicPlayer />
          <Router>
              <div className={`main-content`}>
                  <TopBar class={this.state.className}/>
                  <div className={`header`}>
                      <ul className={`top-links clearFix`}>
                          <li><NavLink to={`/Create`}   activeClassName={`active`}> <i className={`icon-username`}></i>Create</NavLink></li>
                          <li><NavLink to={`/skill`} activeClassName={`active`}> <i className={`icon-upgrade`}></i>Skill</NavLink></li>
                          <li><NavLink to={`/PersonalProjects`} activeClassName={`active`}> <i className={`icon-star`}></i>Personal Projects</NavLink></li>
                          <li><NavLink to={`/Contact`} activeClassName={`active`}> <i className={`icon-mail`}></i>Contact</NavLink></li>
                      </ul>
                  </div>
                  <div className={`content`}>
                      {/*路由重定向*/}
                      <Route path={`/`} exact render={()=>(<Redirect to={`/Create`}/>)}/>
                      {
                          routes.map((route,i) => (
                              <RouteWithSubRoutes popMsg={this.popMsg} key={i} {...route}/>
                          ))
                      }
                  </div>
              </div>
          </Router>
      </div>
    );
  }
}
/*简介页*/
class Create extends Component{
    constructor(props){
        super(props);
        this.state={
            top:0,
            title:'',
            currentElem:0//当前选中的按钮
        }
    }
    handleClick=(e)=>{
        const title = e.target.getAttribute('label');
        this.setState({title:title})
    }
    render(){
        return(
            <Router>
                <div className={`clearFix`}>
                    <ScrollToTopOnMount/>
                    <div className={`left-link`}>
                        <ul className={`links`}>
                            <li><NavLink to={`/Create/MyResume`}  onClick={this.handleClick} label={`个人简历`} activeClassName={`current`}>My Resume</NavLink></li>
                            <li><NavLink to={`/Create/GrowthRecord`} onClick={this.handleClick} activeClassName={`current`} label={`个人履历`}>Growth Record</NavLink></li>
                            <li><NavLink to={`/Create/MyPhotos`} onClick={this.handleClick} activeClassName={`current`} label={`一些照片`}>My Photos</NavLink></li>
                            <li><NavLink to={`/Create/MyHobby`} onClick={this.handleClick} activeClassName={`current`} label={`个人喜好`}>My Hobby</NavLink></li>
                        </ul>
                    </div>
                    <div className={`right-content`}>
                        {/*二级路由重定向*/}
                        <Route path={`/Create`} exact render={()=>(<Redirect to={`/Create/MyResume`}/>)}/>
                        {
                            this.props.routes.map( (route,i)=> {
                                return  <RouteWithSubRoutes key={i} {...route}/>
                            })
                        }
                    </div>
                </div>
            </Router>
        )
    }
}
    /*相片页逻辑*/
class  PhotoRoute extends Component{
    constructor(props){
        super(props)
        this.state={
            ModalUrl:'',/*图片路径*/
            isShow:false,/*查看大图模态框显示与隐藏*/
            ImgTitle:'',/*图片title*/
            picKey:0/*当前查看的图片key*/
        }
    }
    handleClick = (e)=>{
        let key = e.target.getAttribute('data-key');
        this.setState((prevState)=>({
            isShow:!prevState.isShow,
        }));
        this.changePic(key);
    }
    changePic = (key)=>{ /*公共改变图片方法*/
        if(key !== null){
            this.setState({
                ModalUrl:`http://${window.location.host}/${ImageData[parseInt(key)].url ? ImageData[parseInt(key)].url : ''}`,
                ImgTitle:ImageData[parseInt(key)].title,
                picKey:parseInt(key)
            })
        }
    }
    turnPage = (e) =>{
        let direction = parseInt(e.target.getAttribute('direction'));
        let key = this.state.picKey;
        if(direction>0){
            this.changePic(key+1);
        }else{
            this.changePic(key-1);
        }
    }
    render(){
        return(
            <div className={`photos`}>
                {
                    ImageData.map( (key)=> {
                        return(
                            <a  href={`javascript:;`} onClick={this.handleClick} key={key.id} >
                                {/*父组件传值不允许穿key属性*/}
                                <Image url={`http://${window.location.host}/${key.url}`} k={key.id} styles={{h:100,w:100}}/>
                                <p data-key={key.id}>{key.title}</p>
                            </a>
                        )
                    })
                }
                <Modal url={this.state.ModalUrl} turnPage={this.turnPage} picKey={this.state.picKey} title={this.state.ImgTitle} isShow={this.state.isShow} ModelClose={this.handleClick}/>
            </div>
        )
    }
}

function Image(props) {
    return(
        <img alt={`相片`} src={props.url} data-key={props.k} style={{height:props.styles.h,width:props.styles.w}}/>
    )
}

/*技能页*/
class Skill extends Component {
    constructor(props){
        super(props);
        this.state={
            start:false
        }
    }
    componentDidMount(){
        setTimeout( ()=> {
            this.setState({start:true})
        },100)
    }
    render(){
        return(
            <div className={`skill`}>
                <ScrollToTopOnMount/>
                <h2>各项技能指数</h2>
                <div className={`skill-content`}>
                    {
                        SkillData.map((v,k)=>(
                            <SkillBar key={k} barWith={v.bar_with} state={this.state.start} name={v.name}/>
                        ))
                    }
                </div>
                <div className={`skill-context`}>
                    使用的技术栈方面，因为本身一开始学习的就是原生的JS以及BOM和DOM，所以基础的知识比较牢的，后续用到了一些框架，比如像PHP的CI框架，这种MVC的，后续就用了像React和Vue，然后自己本身也很喜欢MVC类型的框架。对技术来说也有自己的追求，自己造轮子自己用也是自己的目标，现在偶尔偷偷轮子看看源码，也学习过一切后端语言，像Python，.go。
                </div>
            </div>

        )
    }
}
    /*技能条*/
function SkillBar(props) {
    return(
        <div className={`skill-chart`}>
            <div className={`skill-bar ${props.name}`} style={{width:`${props.state && props.barWith}%`}}>
                <span></span>
            </div>
            <p className={`skill-name`}>{props.name}</p>
        </div>
    )
}
/*个人项目页*/
class PersonalProjects extends Component{
    constructor(props){
        super(props)
    }
    render(){
        return(
            <div className={`PersonalProjects`}>
                <ScrollToTopOnMount/>
                <h2>关于做过的项目</h2>
                <div className={`project-item`}>
                    
                </div>
            </div>
        )
    }
}
/*admin管理页*/
 class Admin extends Component{
     constructor(props){
         super(props)
         const user = JSON.parse(localStorage.getItem('king-token'));
         this.state={
             token:user!==null ? user.token : null,
             user_info:{username:user !== null ? user.username : '',last_work_time:user !== null ? user.last_work_time : ''},
             tab:0,
         }
     }
     hanleHideLoginModel=(res)=>{//手动登录过后隐藏登录框
        this.setState({
            token:res.token,
            user_info:{username:res.username,last_work_time:res.last_work_time}
        })
     }
     render(){
         if(this.state.token===null){
             return <LoginModel popMsg={this.props.popMsg}  hanleHideLoginModel={this.hanleHideLoginModel}/>
         }else{
             return(
                 <div className={`admin`}>
                    <div className={`user-info`}>
                        {this.state.user_info!=='' ? <i className={`status mr10`}></i>:''}
                        {this.state.user_info.username!=='' ? <span className={`username mr10`}>{this.state.user_info.username}</span>:''}
                        {this.state.user_info.last_work_time!=='' ? <span className={`last-work-time`}>上一次登录：{this.state.user_info.last_work_time}</span>:''}
                    </div>
                    <Router>
                        <div className={`setting-groups`}>
                            <div className={`setting-box clearFix mt10`}>
                                <div className={`nav-tab clearFix`}>
                                    <NavLink to={`/Admin/PublishPictures`} className={`fl`}  activeClassName={`active`}>Publish Pictures</NavLink>
                                    <NavLink to={`/Admin/PublishProjects`} className={`fl`}  activeClassName={`active`}>Publish Projects</NavLink>
                                </div>
                                <div className={`tab-box`}>
                                    {/*二级路由重定向*/}
                                    <Route path={`/Admin`} exact render={()=>(<Redirect to={`/Admin/PublishPictures`}/>)}/>
                                    {
                                        this.props.routes.map((route,i)=> {
                                            return  <RouteWithSubRoutes popMsg={this.props.popMsg} key={i} {...route}/>
                                        })
                                    }
                                </div>
                            </div>
                        </div>
                    </Router>
                 </div>
                 
             )
         }
     }
 }
/*admin发布项目*/
class PublishProjects extends Component{
    componentDidMount(){
    
    }
    render(){
        return(
            <div>
                <button ref={`add`}>添加</button>
            </div>
        )
    }
}  
/*登录模态框*/
class LoginModel extends Component{
    constructor(props){
        super(props)
        this.state = {
            username:'',
            password:'',
            error:''
        }
    }
    login = async(param)=>{
        const res = await http.post(api.login,param);
        if(res.status===1){
            localStorage.setItem('king-token',JSON.stringify(res));//转换为json存入
            this.props.hanleHideLoginModel(res);//成功之后隐藏登录框
            let msg_obj = {msg:`欢迎回来 ${res.username}`,status:res.status}
            this.props.popMsg(msg_obj);
        }else{
            let msg_obj = {msg:res.msg,status:res.status}
            this.props.popMsg(msg_obj);
        }
    }
    submit_click=()=>{
        if(this.state.username==='' || this.state.password===''){
            let msg_obj = {msg:'账号或密码不可为空',status:0}
            this.props.popMsg(msg_obj);
            return false;
        };
        let param = {
            username:this.state.username,
            password:this.state.password
        }
        this.login(param);
    };
    inset_value=(e)=>{
        if(e.target.name ==='password'){
            this.setState({password:e.target.value})
        }else{
            this.setState({username:e.target.value})
        }
    }
    render(){
        return(
            <div className={`login-model`}>
                <div className={`login-box`}>
                    <div className={`from-item mt15`}>
                        <span>Username</span><div className={`input-box`}><i className={`icon-username`}></i><input onChange={this.inset_value} type="text" name={`username`} placeholder={`请输入用户名`}/></div>
                    </div>
                    <div className={`from-item mt15`}>
                        <span>Password</span><div className={`input-box`}><i className={`icon-visible`}></i><input onChange={this.inset_value} type="password" name={`password`} placeholder={`请输入密码`}/></div>
                    </div>
                    <div className={`from-item mt15`}>
                        <a onClick={this.submit_click} className={`sure mr15`}>Sign in</a>
                        <a className={`cancel ml15`}>go back</a>
                    </div>
                </div>
            </div>
        )
    }
}
/*气泡消息框*/  
class MsgTips extends Component{
    constructor(props){
        super(props);
        this.state={
            show:false,//会话消息显示隐藏
            msg:'',//会话消息文字
            status:0//会话消息状态
        }
    }
    componentWillReceiveProps(newProps){
        if(newProps.msg){
            this.setState({
                show:true,
                msg:newProps.msg,
                status:newProps.status
            })
        }
    }
    shouldComponentUpdate(nextProps,nextState){
        if(this.state.show===nextState.show){
                return false
        }
        return true;
    }
    componentDidUpdate(){
        if(this.state.show){
             this.setShowTime(3000);
        }
    }
    setShowTime = async(s)=>{
        const time = await setTimeout(()=>{
            this.setState({
                show:false
            })
            this.props.popMsg({msg:'',status:0})//清空消息
        },s)
    }
    render(){
        return(
            <div className={`msg-tips ${this.state.show===true ? 'show':''}`}>
                <i className={`mr5 ${this.state.status === 1?'success':'error'}`}></i>
                <span>{this.state.msg}</span>
            </div>
        )
    }
} 
/*得到我*/
class Contact extends Component{
    constructor(props){
        super(props)
    }
    render(){
        return(
            <div>
                <ScrollToTopOnMount/>
                <h1>Contact</h1>
            </div>
        )
    }
}
/*顶部悬浮导航条*/
function TopBar(props) {
    let className = props.class;
    return(
        <div className={`top-Bar ${className}`}>
            <div className={`links clearFix`}>
                <NavLink to={`/Create`} activeClassName={`active`}   className={`icon-username`}></NavLink>
                <NavLink to={`/skill`} activeClassName={`active`}  className={`icon-upgrade`}></NavLink>
                <NavLink to={`/PersonalProjects`} activeClassName={`active`}  className={`icon-star`}></NavLink>
                <NavLink to={`/Contact`} activeClassName={`active`} className={`icon-mail`}></NavLink>
            </div>
        </div>
    )
}
/*简介页*/
function MyResume() {
    return(
        <div>
            <div className={`head-bar`}>
                <span className={`title`}>个人简介</span>
            </div>
            <div className={`warp`}>
                <div className={`article`}>
                    <div className={`portrait`}>
                        <img src={require('./img/portrait.jpg')} alt="头像"/>
                    </div>
                    <h2>王 田</h2>
                    <h4 className={`mt10`}>邮箱：2281334050@qq.com</h4>
                    <h4 className={`mt5`}>毕业院校：上海电视大学，计算机应用与管理</h4>
                    <h4 className={`mt5`}>Github：<a target={`_blank`} className={`linkStyle`} href="https://github.com/2281334050">Tian King</a></h4>

                </div>
            </div>
        </div>
    )
}
/*成长页*/
function GrowthRecord() {
    return(
        <div>
            <div className={`head-bar`}>
                <span className={`title`}>个人履历</span>
            </div>
            <div className={`warp`}>
                <div className={`article`}>

                </div>
            </div>
        </div>
    )
}
/*相册页*/
function MyPhotos() {
    return(
    <div>
        <div className={`head-bar`}>
            <span className={`title`}>一些照片</span>
        </div>
        <div className={`warp`}>
            <div className={`article`}>
                <PhotoRoute/>
            </div>
        </div>
    </div>
    )
}
/*爱好页*/
function MyHobby() {
    return(
        <div>
            <div className={`head-bar`}>
                <span className={`title`}>一些喜好</span>
            </div>
            <div className={`warp`}>
                <div className={`article`}>

                </div>
            </div>
        </div>
    )
}
/*路由配置*/
const routes = [
    {
        path:'/Create',
        component:Create,
        routes:[
            {
                path:'/Create/MyResume',
                component:MyResume
            },
            {
                path:'/Create/GrowthRecord',
                component:GrowthRecord
            },
            {
                path:'/Create/MyPhotos',
                component:MyPhotos
            },
            {
                path:'/Create/MyHobby',
                component:MyHobby
            }
        ]

    },
    {
        path:'/skill',
        component:Skill
    },
    {
        path:'/PersonalProjects',
        component:PersonalProjects
    },
    {
        path:'/Contact',
        component:Contact
    },
    {
        path:'/Admin',
        component:Admin,
        routes:[
            {
                path:'/Admin/PublishPictures',
                component:PublishPictures
            },
            {
                path:'/Admin/PublishProjects',
                component:PublishProjects
            }
        ]
    }
];
/*路由公共方法*/
function RouteWithSubRoutes (route){
    return(
        <Route path={route.path}  render={(props)=>
            {
                return <route.component popMsg={route.popMsg} {...props} routes={route.routes}/>
            }
        }/>
    )
}
/*路由跳转回到顶部组件*/
class ScrollToTopOnMount extends Component {
    componentDidMount(prevProps) {
        window.scrollTo(0, 0)
    }

    render() {
        return null
    }
}
/*AJAXloading条*/
function Ajax_loading() {
    return(
        <div className={`ajaxLoader`}>
            <div className={`outer`}></div>
            <div className={`inner`}></div>
        </div>
    )
}
/*相册页查看大图模态框*/
function Modal (props) {
    if(!props.isShow){
        return null
    }
    return (
        <div className={`modal`}>
            <div className={`pics`}>
                <Image url={props.url} styles={{h:500,w:500}} />
                <p>{props.title}</p>
                <a className={`close icon-close`} href={`javascript:;`} onClick={props.ModelClose}>
                </a>
                {
                    function () {
                        if(props.picKey>0 && props.picKey < ImageData.length-1){
                            return(
                                <div>
                                    <a href={`javascript:`} direction={-1} onClick={props.turnPage} className={`left-tick  icon-left-arrow`}> </a>
                                    <a href={`javascript:`} direction={1} onClick={props.turnPage} className={`right-tick  icon-left-arrow`}> </a>
                                </div>
                                )

                        }else{
                            if(props.picKey === 0){
                               return <a href={`javascript:;`} direction={1} onClick={props.turnPage} className={`right-tick  icon-left-arrow`}> </a>
                            }else if(props.picKey === ImageData.length-1){
                                return <a href={`javascript:;`} direction={-1} onClick={props.turnPage} className={`left-tick  icon-left-arrow`}> </a>
                            }
                        }
                    }()
                }
            </div>
        </div>
    )
}
/*音乐播放器主体*/
class MusicPlayer extends Component{
    constructor(props){
        super(props);
        this.state={
            songListId:694628395,
            songList:[],
            src:'',/*音频文件地址*/
            currentTime:0,/*音频当前播放时间s*/
            volume:0,/*音量*/
            muted:false,/*静音*/
            progress:0,/*进度条显示的进度*/
            pic:'',
            songName:'未知',
        /*以下是只读属性*/
            duration:0,/*媒体的时长S为单位*/
            paused:false,/*暂停是true,反之false*/
            currentSong:sessionStorage.hasOwnProperty('currentSong')?parseInt(sessionStorage.getItem('currentSong')):0,//当前播放的歌曲，从0开始计
            lockState:false,//音乐窗口锁
            songLrc:[],//歌词
            songLrcShow:false,//显示歌词
            currentLrc:0,//当前第几句歌词

        }
    }
    componentDidMount(){
        let param = `{"TransCode":"020331","OpenId":"Test","Body":{"SongListId":"${this.state.songListId}"}}`;
         let params = JSON.parse(param);
      axios({
          method:'post',
          url:'https://api.hibai.cn/api/index/index',
          headers:{
              'Content-Type':'application/x-www-form-urlencoded'/*axios跨域请求头部*/
          },
         data:qs.stringify(params),/*使用跨域头部过后，参数需要引用qs*/
      }).then((res)=>{
          if(res.status === 200){
              this.setState({
                  songList:res.data.Body,
                  src:res.data.Body[this.state.currentSong].url
              })
          }
      })
    }
    setProgress=(progress,currentTime)=>{
        this.setState({
            progress:progress*100,
            currentTime:currentTime
        })
    }
    dragDropHandler=(e)=>{
        let progress = parseFloat((e.clientX-(document.documentElement.clientWidth-93-180))/180);/*点击时获取的进度条百分比*/
        let currentTime = Math.floor(this.state.duration * progress);/*选中的秒数*/
        if(progress < 0 || currentTime < 0){
            this.setProgress(0,0)/*进度条刷新并刷新当前秒数*/
        }else if(progress > 1){
            this.setProgress(1,Math.floor(this.state.duration * 1))/*进度条刷新并刷新当前秒数*/
        }else{
            this.setProgress(progress,currentTime)/*进度条刷新并刷新当前秒数*/
        }
        this.refs.audio.currentTime=currentTime;
    }
    putPaused=()=>{/*暂停 播放*/
        if(this.refs.audio.paused) {
            this.refs.audio.play();
        }else{
            this.refs.audio.pause();
        }
        this.setState({paused:this.refs.audio.paused});
    }
    audioChange=(e)=>{
        switch (e.type){
            case 'abort':{
                break;
            }
            case 'error':{
                if(this.state.src !== ''){
                    if(this.refs.audio.networkState===3){
                        this.setState((prevState)=>{//因为回调函数会造成state的延迟响应，所以下面这句要放在外面写↓
                                let state = prevState.songList.concat(prevState.songList[this.state.currentSong].cannotPlay=false);
                               return {songList:state}
                            }
                        );
                        this.nextMusic()
                    }//如果当前资源地址不可用，跳下一曲
                }
                break;
            }
            case 'canplay':{
                let duration = parseInt(this.refs.audio.duration);
                let pic  = this.state.songList[this.state.currentSong].pic;
                let songName = this.state.songList[this.state.currentSong].title;
                this.refs.musicBox.scrollTop = this.refs.currentSong.refs.currentSong.offsetHeight * this.state.currentSong;/*计算元素距离顶部高度，保证切换下一曲时，当前播放歌曲能显示在最顶部*/
                sessionStorage.setItem('currentSong',this.state.currentSong);//将当前播放歌曲加入缓存
                this.parseLyric();
                    this.setState({/*设置专辑封面，歌名，歌手*/
                        duration:duration,
                        pic:pic,
                        songName:songName
                    });
                    this.refs.audio.play().catch(function (error) {
                        //这里为了处理异常的dom用catch错误，原因是safari浏览器不支持autoplay
                        //console.log(error)
                    })
                    //console.log(playPromise);
                    this.setState({paused:this.refs.audio.paused});
                break;
            }
            case 'ended':{/*音频结束之后触发*/
                this.nextMusic();
                break
            }
            case 'timeupdate':{/*正在播放中*/
                let readyState = this.refs.audio.readyState;
                if(readyState === 4){/*audio.buffered.end 必须在 audio 对象获取到信息时才可以使用*/
                    //console.log(this.refs.audio.buffered.end(0));
                }
                for(let i =0;i<this.state.songLrc.length;i++){
                     if(parseInt(this.refs.audio.currentTime) > this.state.songLrc[i][0]){
                        this.setState({currentLrc:i});
                        if(this.refs.hasOwnProperty('currentLrc')){
                            this.refs.lrcBox.scrollTop = (this.refs.currentLrc.refs.currentLrc.offsetHeight * this.state.currentLrc)-60;
                        }
                     }
                }
                this.setProgress(parseInt(this.refs.audio.currentTime)/this.state.duration,parseInt(this.refs.audio.currentTime));
                break
            }
            default:{
                console.log('default');
            }
        }
    };
    PrevMusic = ()=>{//上一曲
        this.setState({
            src:this.state.songList[this.state.currentSong > 0 ? this.state.currentSong-1 : 0].url,
            currentSong:this.state.currentSong > 0 ? this.state.currentSong-1 : 0
        })
    };
    nextMusic = ()=>{//下一曲
        this.setState({
            src:this.state.songList[this.state.currentSong < this.state.songList.length-1 ? this.state.currentSong+1 : 0].url,
            currentSong:this.state.currentSong < this.state.songList.length-1 ? this.state.currentSong+1 : 0
        })
    };
    setLock = ()=>{//锁
        this.setState((prevState)=>({lockState:!prevState.lockState}))
    };
    parseLyric =()=>{//取歌词
        let result = [];
        this.setState({songLrc:[]});//清空歌词
        axios({
            url:this.state.songList[this.state.currentSong].lrc,
            method:'get'
        }).then((res)=>{
            if(res.status === 200){
                if(res.data === '暂无歌词'){
                    return
                }
                let lines = res.data.split('\n'),
                    pattern = /\[([0-9]+:[0-9]+.[0-9]+)\]/g;
                while (!pattern.test(lines[0])){
                    lines = lines.slice(1);
                }
                lines[lines.length - 1].length === 0 && lines.pop();
                lines.forEach(function (v) {
                    let time = v.match(pattern),//分割出时间
                        value = v.replace(pattern,'');//分割出歌词
                    time.forEach(function (v1) {
                        let t = v1.slice(1,-1).split(':');//从时间分割出分钟
                        result.push([parseInt(t[0],10) * 60 + parseFloat(t[1]),value])//将时间化为秒数及对应歌词放入数组
                    })
                });
                result.forEach(function (v,k) {
                    if(v[1]===''){
                        result.splice(k,1)
                    }
                })
                result.sort(function (a,b) {
                    return a[0] -b[0]
                });
                this.setState({songLrc:result})
            }
        })
    };
    showLrc = () =>{
       this.setState((prevState)=>({
           songLrcShow:!prevState.songLrcShow
       }))
    }
    chooseMusic = (e)=>{
        e.preventDefault();
        let num = parseInt(e.target.getAttribute('href'));
        this.setState({
            src:this.state.songList[num].url,
            currentSong:num
        })
    }
    render(){
        return(
            <div className={`player ${this.state.lockState ? 'out':''}`}>
                <a href="javascript:" className={`fade-out`}>
                    <i className={`icon-arrange-class`}></i>
                </a>
                <div className={`video-box`}>
                    <div className={`top`}>
                        <a href="javascript:" onClick={this.setLock} className={`${this.state.lockState ? 'icon-lock':'icon-lock-open'}`}>{}</a>
                        <audio
                            ref={`audio`}
                            onCanPlay={this.audioChange}
                            onAbort={this.audioChange}
                            onTimeUpdate={this.audioChange}
                            onSeeked={this.audioChange}
                            onEnded={this.audioChange}
                            onError={this.audioChange}
                            src={this.state.src}>{}</audio>
                        <div className={`pic ${this.state.songLrcShow ? 'lrc-show' : ''}`}>
                            <img src={this.state.pic === '' ? songEmpty : this.state.pic} alt="专辑封面"/>
                        </div>
                        <ul ref={`lrcBox`} onClick={this.showLrc} className={`song-lrc ${this.state.songLrcShow ? 'lrc-show' : ''}`}>
                            {
                                this.state.songLrc.length ===0 ? <li className={`no-lrc`}>暂无歌词</li>: this.state.songLrc.map((v,k)=>{
                                  return <SongLrc  key={k} LrcInfo={v[1]} index={k} currentLrc={this.state.currentLrc} ref={`${this.state.currentLrc === k ? 'currentLrc':''}`}/>
                                        })

                            }
                        </ul>
                        <p className={`name`}>{this.state.songName}</p>
                        <div className={`control`}>
                            <div className={`progress-bar`} onClick={this.dragDropHandler}>
                                <div style={{width:this.state.progress+'%'}}>
                                </div>
                            </div>
                            <span className={`time`}>{`${parseInt(this.state.currentTime/60)%60<10 ?'0'+parseInt(this.state.currentTime/60)%60:parseInt(this.state.currentTime/60)%60}:${this.state.currentTime%60 < 10 ? '0' + this.state.currentTime%60 : this.state.currentTime%60}/${parseInt(this.state.duration/60)%60 < 10 ? '0'+parseInt(this.state.duration/60)%60:parseInt(this.state.duration/60)%60}:${this.state.duration%60 < 10 ? '0'+this.state.duration%60 :this.state.duration%60}`}</span>
                            <div className={`btn`}>
                                <div onClick={this.PrevMusic} className={`prev`}><i className={` icon-rewind`}></i></div>
                                <div onClick={this.putPaused} className={`play`}><i className={!this.state.paused ? "icon-pause-1" : " icon-play-1"}></i></div>
                                <div onClick={this.nextMusic} className={`next`}><i className={` icon-fast-fw-1`}></i></div>
                            </div>
                        </div>
                    </div>
                    <ul ref={`musicBox`} className={`song-list`}>
                        {
                            this.state.songList.map((value,key)=>(
                                <Song chooseMusic={this.chooseMusic} songInfo={value} key={key} index={key} currentSong={this.state.currentSong} ref={`${this.state.currentSong === key ?'currentSong':''}`}/>
                            ))
                        }
                    </ul>
                </div>
            </div>
        )
    }
}
/*歌词列表，列表分出，做优化操作*/
class SongLrc extends Component{
    constructor(props){
        super(props)
    }
    shouldComponentUpdate(nextProps){ //*优化内存处理，当歌曲发生改变时，才去再次渲染歌词列表*//
        if(nextProps.currentLrc===this.props.currentLrc){
            return false
        }else{
            return true
        }
    }
    render(){
        return <li ref={`${this.props.currentLrc === this.props.index ? 'currentLrc':''}`} className={`${this.props.currentLrc === this.props.index ? 'current':''}`} key={this.props.index}>{this.props.LrcInfo}</li>
    }
}
/*播放的歌曲列表,列表分出，可进行部分优化操作*/
class Song extends Component{
    constructor(props){
        super(props);
    }
    shouldComponentUpdate(nextProps,nextState){/*优化内存处理，当歌曲发生改变时，才去再次渲染列表*/
        if(nextProps.currentSong===this.props.currentSong) {
            return false
        }else{
            return true
        }
    }
    render(){
        return(
                 <li title={this.props.songInfo.hasOwnProperty('cannotPlay') && this.props.songInfo.cannotPlay===false ? '该歌曲存在版权问题不可播放' : '点击播放该歌曲'}  ref={`${this.props.currentSong === this.props.index ?'currentSong':''}`}  className={`item ${this.props.songInfo.hasOwnProperty('cannotPlay') && this.props.songInfo.cannotPlay===false ? 'playDisabled' : ''}  ${this.props.currentSong === this.props.index ? 'active':''}`}>
                    <a  onClick={this.props.chooseMusic} href={this.props.index} className={`song-name`}>{this.props.songInfo.title}</a>
                    <span className={`${this.props.songInfo.hasOwnProperty('cannotPlay') && this.props.songInfo.cannotPlay===false ? 'playDisabled' : ''} author-name`}>{this.props.songInfo.author}</span>
                </li>

        )
    }
}
/*以下是redux测试代码*/
function counter(state = 0, action) {
    switch (action.type) {
        case 'INCREMENT':
            return state + 1;
        case 'DECREMENT':
            return state - 1;
        default:
            return state;
    }
}
let store = createStore(counter);
store.subscribe(() =>
    console.log(store.getState())
);
store.dispatch({ type: 'INCREMENT' });
store.dispatch({ type: 'DECREMENT' });
export default App;
