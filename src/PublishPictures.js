import React, { Component } from 'react';
import http from './server';//封装的请求方法
import api from './libraries/api_list';//接口列表
import settings from './settings';
import * as qiniu from 'qiniu-js';
import PublicModel from './publicModel';//公共弹出框
class PublishPictures extends Component{
  constructor(props){
      super(props);
      const user = JSON.parse(localStorage.getItem('king-token'));
      this.state={
          current_photo_list:null,
          photo_lists:{
            list:[],
            is_ajaxing:false
          },
          photos:{list:[],is_ajaxing:false},
          isShow:0,//model对话框0 不显示 1新建相册 2上传照片 3照片编辑 4编辑相册名称 5弹出提示对话框
          photo_list_name:'',//最后提交相册的name
          edit_photo_list_id:null, //当前点击编辑的相册的id
          upload_token:user!==null ? user.token.split(".")[3] : null,//上传所需token
          upload_config:{//上传配置
              useCdnDomain: true,
              disableStatisticsReport: false,
              retryCount: 6,
              region: qiniu.region.z0
          },
      }
  }
  GetPhotoLists= async ()=>{//获取相册列表
    this.setState({
        photo_lists:{list:[],is_ajaxing:true},
    })
      const res = await http.get(api.get_photo_lists,[]);
      if(res.status===1){
          this.setState({
              photo_lists:{list:res.list,is_ajaxing:false},
          })
          let flag = false;
          if(this.state.photo_lists.list.length!==0){
              this.state.photo_lists.list.map((v,k)=>{
                  if(this.current_photo_list === v.id){
                      flag = true;
                  }
              })
              if(!flag){
                  this.setState({
                      current_photo_list:res.list[0].id
                  })
              }
              this.GetPhotos();
          }else{
              this.setState({
                  current_photo_list:null
              })
          }
      }
  }
  GetPhotos= async ()=>{//取图片
    this.setState({
        photos:{list:[],is_ajaxing:true},
    })
      let param = {photo_list_id:this.state.current_photo_list}
      const res = await http.post(api.get_photos,param);
      if(res.status===1){
          this.setState({
              photos:{list:res.list,is_ajaxing:false},
          })
      }
  }
  componentDidMount(){
      this.GetPhotoLists();//获取相册列表
  }
  insetInput=(e)=>{
      this.setState({
          photo_list_name:e.target.value
      })
  }
  handleChange= async (e)=>{//切换相册
      await this.setState({
          current_photo_list:parseInt(e.target.value)
     });
     this.GetPhotos();
  }
  popBoxBtnSure=(e)=>{//请求添加相册接口//编辑相册入口//删除相册入口
      let msg_obj={},
          params;
      switch(this.state.isShow){
          case 1:case 4:
              if(this.state.photo_list_name===''){
              msg_obj = {msg:'请输入相册名称',status:0}
              this.props.popMsg(msg_obj);
              return false;
              }
              if(this.state.isShow === 1){//新增
                  params = {name:this.state.photo_list_name};
                  this.publicAJAX(params,api.addPhotoAlbum,'POST');
              }else{//编辑
                  params = {id:this.state.edit_photo_list_id,new_name:this.state.photo_list_name}
                  this.publicAJAX(params,api.edit_photo_list,'POST');
              }
          break;
          case 5:
              params = {id:this.state.edit_photo_list_id}
              this.publicAJAX(params,api.delete_photo_list,'POST');
          break;
          default:
          break;
      }
  }
  showPopBox=(e)=>{//打开弹窗
      let type = parseInt(e.target.getAttribute('data-type'));
      let old_name = e.target.getAttribute('data-name') === null ? '':e.target.getAttribute('data-name');
      let edit_list_id = e.target.getAttribute('data-id') === null ? null:parseInt(e.target.getAttribute('data-id'));
      this.setState({
          isShow:type,
          photo_list_name:old_name,
          edit_photo_list_id:edit_list_id
      })
  }
  cancel=()=>{//关闭弹窗
      this.setState({
          isShow:0,
          photo_list_name:'',
          edit_photo_list_id:null
      })
  }
  popBoxHtml=()=>{//popbox弹窗内容
      if(this.state.isShow){
          switch (this.state.isShow){
              case 1:case 4://编辑&&新建相册
                  return (<PublicModel className={`CreatePhotoAlbum`} title={`新建相册`}>
                      <div className={`form-item mt15`}>
                          <input type="text" name={`name`} defaultValue={this.state.photo_list_name} onChange={this.insetInput} placeholder={`请输入相册名`}/>
                      </div>
                      <div className={`form-item mt15`}>
                          <a className={`sure`} onClick={this.popBoxBtnSure} href="javascript:;">提交</a>
                          <a className={`cancel`} onClick={this.cancel} href="javascript:;">取消</a>
                      </div>
                  </PublicModel>);
                  break;
              case 2://添加相片
              return(<PublicModel className={`uploadImage`} title={`上传图片`}>
                      <div className={`form-item`}>
                          <div className={`img-list clearFix`}>
                              <div className={`img-item fl`}>
                                  <img src={`http://pdhr9nhxj.bkt.clouddn.com/396880416-585284b57b021.jpeg`}/>
                                  <div className={`progress-mark`}>
                                      <div className={`progress`}>
                                          <div className={`progress-bar`}></div>
                                      </div>
                                  </div>
                              </div>
                          </div>
                          <a id={`add-img`}></a>
                      </div>
                  </PublicModel>);
                  break;
              case 3:
                  break;
              case 5:
              return(<PublicModel className={`MsgTips`} title={`提示`}>
                      <div className={`form-item mt15`}>
                          <div className={`msg`}>确定删除该相册吗？</div>
                      </div>
                      <div className={`form-item mt15`}>
                          <a className={`sure`} onClick={this.popBoxBtnSure} href="javascript:;">确定</a>
                          <a className={`cancel`} onClick={this.cancel} href="javascript:;">取消</a>
                      </div>
                  </PublicModel>);
                  break;
              default:
                  break;
          }
      }else{
          return null;
      }
  }
  publicAJAX=async(params,api,method)=>{//公共ajax
      let msg_obj={},
          res;
      if(method==='POST'){
           res = await http.post(api,params);
      }else{
           res = await http.get(api,params);
      }
      if(res.status===1){
           msg_obj = {msg:res.msg,status:1};
          this.props.popMsg(msg_obj);
          this.cancel();//关闭对话
          this.GetPhotoLists();//取得相册列表
      }else{
           msg_obj = {msg:res.msg,status:0};
          this.props.popMsg(msg_obj);
      }
  }
  initUpload(file,key,token,putExtra,config){
      let observable = qiniu.upload(file,key,token,putExtra,config);
          observable.subscribe({
              next:(res)=>{
                  const total = res.total;
                 let photos = this.state.photos.list;
                  photos.map((v,k)=>{
                      if(v.key === key){
                          v.progress = total.percent
                          this.setState({
                              photos:{list:photos,is_ajaxing:false}
                          })
                      }
                  })
              },
              error:(res)=>{
                  if(res.code===401){
                    localStorage.removeItem('king-token');
                    window.location.href=`/admin`;
                  }
              },
              complete:(res)=>{
                  if(res.status===1){
                      let photos = this.state.photos.list;
                      photos.map((v,k)=>{
                          if(v.key === key){
                              photos[k] = res.data[0];
                              this.setState({
                                  photos:{list:photos,is_ajaxing:false}
                              })
                          }
                      }) 
                  }
              }
          });
  }
  changeFile=(e)=>{//选取上传文件
      let file = e.target.files[0];
      if(file){
          let key  = file.name;
          let putExtra={
              fname:'',
              params:{
                  "x:name":key.split(".")[0],
                  "x:photo_list_id":this.state.current_photo_list,
              },
              mimeType:settings.upload.allowType||null
          };
          const new_img = {
              id:null,
              key:key,
              name:key.split(".")[0],
              is_loading:true,
              progress:0,
              url:''
          }
          if(typeof FileReader !== 'undefined'){//判断浏览器支持base64转码
              //上传前预览
          let reader = new FileReader();
              reader.readAsDataURL(file);
              reader.onload = (e)=>{//转图片为base64
                  new_img.url = e.currentTarget.result,
                  this.setState((prevState)=>{
                      return {photos:{list:prevState.photos.list.concat(new_img),is_ajaxing:false}}
                  })
              }
          }
          //上传初始化开始
          this.initUpload(file,key,this.state.upload_token,putExtra,this.state.upload_config);
      }
  }
  MapPhotos=()=>{//遍历相册
    if(this.state.photos.is_ajaxing){
        return <div style={{textAlign:"center",width:"100%"}}><i className={`icon-spin5 animate-spin`}></i></div>
    }
    if(this.state.photos.list.length>0){
          return this.state.photos.list.map((v,k)=>(
              <div key={k} className={`photo-item fl`}>
                  <div  className={`img-box`}>
                      <img src={v.is_loading?v.url:settings.qiniu.domain+v.key}/>
                      {
                           v.is_loading === true ?
                           <div className={`progress-mark`}>
                               <div className={`progress`}>
                                   <div className={`progress-bar`} style={{width:`${v.progress}%`}}></div>
                               </div>
                           </div>  
                           :''
                      }
                  </div>  
                  <span className={`title`}>{v.name}</span>
              </div> 
            ))
      }else{
          return <div className={`empty`}>暂无照片</div>
      }
  }
  render(){
      return(
          <div className={`PublishPictures`}>
            <div className={`choose-photo-list`}>
            {
              <PhotoLists photo_lists={this.state.photo_lists.list} is_ajaxing={this.state.photo_lists.is_ajaxing} current_photo_list={this.state.current_photo_list} handleChange={this.handleChange} showPopBox={this.showPopBox}/>
            }
            {
               !this.state.photo_lists.is_ajaxing ?<a className={`add-photo-list ml10`} onClick={this.showPopBox} data-type="1" href={`javascript:;`}>NewOne</a>:''
            }
            </div>
            <div className={`photos mt15 clearFix`}>
            {
                this.state.photo_lists.list.length === 0 ? <div className={`empty`}>请先新建相册即可上传照片</div>:this.MapPhotos()
                               
            }
            {//添加按钮
                this.state.photo_lists.list.length !== 0 && 
                  <div className={`fl`}>
                      <a id={`add-photo`} ref={`add_photo`} className={`add-photo fl`}>
                          <input type="file" style={{width:'100%',height:'100%',position:'absolute',opacity:0}} onChange={this.changeFile} id="select"/>
                      </a>
                  </div>
            }
            </div>
              {this.popBoxHtml()}
          </div>
      )
  }
}

class PhotoLists extends Component{
   constructor(props){
      super(props)
   }
   shouldComponentUpdate(nextProps,nextState){
        if(this.props===nextProps){
            return false;
        }
        return true;
   }
   Rush=()=>{
     if(this.props.is_ajaxing){
        return <div style={{textAlign:"center",width:"100%"}}><i className={`icon-spin5 animate-spin`}></i></div>
     }
     if(this.props.photo_lists.length===0){
      return <span className={`empty`}>暂无相册</span>
    }
    if(this.props.photo_lists.length>0){
        return this.props.photo_lists.map((v,k)=>(
          <div key={k}>
          <input type={`radio`} data-list-id={v.id} name={`photo-list`}  checked={this.props.current_photo_list === v.id ? true : false} onChange={this.props.handleChange} value={v.id}/>
          <span>
              <h4>{v.name}</h4>
              <span className={`operation-btn`}>
                  <i data-name={v.name} data-id={v.id} data-type="4" onClick={this.props.showPopBox} className={`icon-pencil mr5`}></i>
                  <i data-id={v.id} onClick={this.props.showPopBox} data-type="5" className={`icon-trash ml5`}></i>
              </span>
          </span>
          </div>  
        ))
    }
   }
   render(){
      return(
        this.Rush()
      )
   }
}

export default PublishPictures;