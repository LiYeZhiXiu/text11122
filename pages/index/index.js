//index.js
//获取应用实例
const app = getApp()
var QQMapWX = require('../../utils/qqmap-wx-jssdk.min.js');
// 实例化API核心类
var qqmapsdk = new QQMapWX({
  key: '5FVBZ-CXM3D-54J4W-PJQEW-HFCRH-7JFLY'
});
Page({
  data: {
    latitude:Number,
    ongitude:Number,
    // 厕所的标记
    markers:[],
    // 路线
    polyline:[]
  },
  onLoad:function(){
    // 获取用户设置的经纬度
    wx.getLocation({
      type: 'gcj02',
      success:res=> {
        this.setData({
          latitude:res.latitude,
          longitude:res.longitude
        })
        this.nearby_search()
      }
    })
  },
  // 获取附近的厕所
  nearby_search: function () {
    var _this = this;
    // 调用接口
    qqmapsdk.search({
      keyword: '厕所',  //搜索关键词
      location: {
        latitude: _this.data.latitude,
        longitude: _this.data.longitude
      },  //设置周边搜索中心点
      success: function (res) { //搜索成功后的回调
         console.log(res)
         var mks=[]
         for(let i=0;i<res.data.length;i++){
           mks.push({
             id:res.data[i].id,
             title:res.data[i].title,
             latitude: res.data[i].location.lat,
             longitude: res.data[i].location.lng,
             iconPath:"../../images/p.png",
             width:20,
             height:20,
             callout:{
               content:res.data[i].title,
               color:"#333",
               fontSize:12,
               borderRadius:4,
               bgColor:"#fff",
               padding:6,
               display:"ALWAYS"
             }
           })
         }
         _this.setData({
           markers: mks
         })
      }
    });
  },
  // 规划步行的路线
  direction:function(e){
    var _this=this
    var mksId=e.markerId
    var lat,lng
    for(let i=0;i<this.data.markers.length;i++){
      if (this.data.markers[i].id==mksId){
        lat =this.data.markers[i].latitude
        lng = this.data.markers[i].longitude
      }
    }
    qqmapsdk.direction({
      mode:"walking",
      to:{
        latitude:lat,
        longitude:lng
      },
      success:res=>{
        // console.log(res)
        var ret = res;
        var coors = ret.result.routes[0].polyline, pl = [];
        //坐标解压（返回的点串坐标，通过前向差分进行压缩）
        var kr = 1000000;
        for (var i = 2; i < coors.length; i++) {
          coors[i] = Number(coors[i - 2]) + Number(coors[i]) / kr;
        }
        //将解压后的坐标放入点串数组pl中
        for (var i = 0; i < coors.length; i += 2) {
          pl.push({ latitude: coors[i], longitude: coors[i + 1] })
        }
        console.log(pl)
        //设置polyline属性，将路线显示出来,将解压坐标第一个数据作为起点
        _this.setData({
          latitude: pl[0].latitude,
          longitude: pl[0].longitude,
          polyline: [{
            points: pl,
            color: '#FF0000DD',
            width: 4
          }]
        })
      }
    })
  }
})
 