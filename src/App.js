import React, { Component } from 'react';
import axios from 'axios';
import qs from 'qs';
import {
    BrowserRouter as Router,
    Route,
    NavLink,
    Redirect
} from 'react-router-dom';
import './style.less';
import ImageData from './imageData';
const requireContext = require.context("./img",true);
const images = requireContext.keys().map(requireContext);
ImageData.map(function (item,i) {
    item.url=images[i]
});
const songEmpty = require('./img/song_empty.png');
console.log(songEmpty);
/*页面主体*/
class App extends Component {
    constructor(props){
        super(props);
        this.state = {
            className:'hide',
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
  render() {
    return (
      <div className={`main`}>
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
                              <RouteWithSubRoutes key={i} {...route}/>
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
                            this.props.routes.map(function (route,i) {
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
                ModalUrl:`http://localhost:3000/${ImageData[parseInt(key)].url}`,
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
                                <Image url={`http://localhost:3000/${key.url}`} k={key.id} styles={{h:100,w:100}}/>
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
        <img  src={props.url} data-key={props.k} style={{height:props.styles.h,width:props.styles.w}}/>
    )
}

/*技能页*/
class Skill extends Component {
    constructor(props){
        super(props)
    }
    render(){
        return(
            <div>
                <ScrollToTopOnMount/>
                <h1>Skill</h1>
            </div>

        )
    }
}
/*个人项目页*/
class PersonalProjects extends Component{
    constructor(props){
        super(props)
    }
    render(){
        return(
            <div>
                <ScrollToTopOnMount/>
                <h1>PersonalProjects</h1>
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
];
/*路由公共方法*/
function RouteWithSubRoutes (route){
    return(
        <Route path={route.path}  render={(props)=>
            {
                return <route.component {...props} routes={route.routes}/>
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
                                    <a href={`javascript:`} direction={-1} onClick={props.turnPage} className={`left-tick  icon-left-arrow`}></a>
                                    <a href={`javascript:`} direction={1} onClick={props.turnPage} className={`right-tick  icon-left-arrow`}></a>
                                </div>
                                )

                        }else{
                            if(props.picKey === 0){
                               return <a href={`javascript:;`} direction={1} onClick={props.turnPage} className={`right-tick  icon-left-arrow`}></a>
                            }else if(props.picKey === ImageData.length-1){
                                return <a href={`javascript:;`} direction={-1} onClick={props.turnPage} className={`left-tick  icon-left-arrow`}></a>
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
            songListId:2211525733,
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
            currentSong:0,//当前播放的歌曲，从0开始计
            lockState:false,//音乐窗口锁
            songLrc:[],//歌词
            songLrcShow:false,//显示歌词
            currentLrc:0,//当前第几句歌词

        }
    }
    componentDidMount(){
        let param = `{"TransCode":"020112","OpenId":"Test","Body":{"SongListId":"${this.state.songListId}"}}`;
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
        //console.log(e.type)
        switch (e.type){
            case 'canplay':{
                let duration = parseInt(this.refs.audio.duration);
                let pic  = this.state.songList[this.state.currentSong].pic;
                let songName = this.state.songList[this.state.currentSong].title;
                let readyState = this.refs.audio.readyState;
                this.refs.musicBox.scrollTop = this.refs.currentSong.offsetHeight * this.state.currentSong;/*计算元素距离顶部高度，保证切换下一曲时，当前播放歌曲能显示在最顶部*/
                this.parseLyric();
                if(readyState === 4 && duration >1){
                    this.setState({/*设置专辑封面，歌名，歌手*/
                        duration:duration,
                        pic:pic,
                        songName:songName
                    })
                    this.refs.audio.play();
                    this.setState({paused:this.refs.audio.paused});
                }else{
                    this.nextMusic();
                }
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
                        if('currentLrc' in  this.refs){
                            this.refs.lrcBox.scrollTop = (this.refs.currentLrc.offsetHeight * this.state.currentLrc)-60;
                        }
                     }
                }
                this.setProgress(parseInt(this.refs.audio.currentTime)/this.state.duration,parseInt(this.refs.audio.currentTime));
                break
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
                                  return <li ref={`${this.state.currentLrc === k ? 'currentLrc':''}`} className={`${this.state.currentLrc === k ? 'current':''}`} key={k}>{v[1]}</li>
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
                        {this.state.songList.map((value,key)=> {
                            return <li key={key} ref={`${this.state.currentSong === key ?'currentSong':''}`} className={`item ${this.state.currentSong === key ? 'active':''}`}>
                                        <a onClick={this.chooseMusic} href={key} className={`song-name`}>{value.title}</a>
                                        <span className={`author-name`}>{value.author}</span>
                                    </li>
                        })}
                    </ul>
                </div>
            </div>
        )
    }
}
export default App;
