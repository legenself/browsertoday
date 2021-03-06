import Vue from "vue";
import Vuex from "vuex";
import ipc from 'ipc2promise'
import VuexPersistence from 'vuex-persist'
const vuexLocal = new VuexPersistence({
  storage: window.localStorage
})
Vue.use(Vuex);
import moment from "moment";
export default new Vuex.Store({
    state: {
        history: [],
        group: [],
        loading: true,
        folder: ""
    },
    getters: {
        timegroups(state) {
            // var group=[]
            var last = null;
            // var current=null
            for (var item in state.history) {
                if (!last) {
                    //时间差小于阈值，则划为一组
                    //大于阈值则创建新组
                }
                last = item;
            }
        }
    },
    mutations: {
        setgroup(state, group) {
            state.group = group;
        },
        sethistory(state, history) {
            state.history = history;
        },
        setloading(state, loading) {
            state.loading = loading;
        },
        setfolder(state, folder) {
            state.folder = folder
        }
    },
    actions: {
        setfolder(content) {
            ipc.send('open-directory-dialog', 'openFile').then(res => {
                content.commit('setfolder', res.filePaths[0])
            });
        },
        fetchhistory(context, time) {

            context.commit("setloading", true);
            // console.log(time)

            var start = moment(time).format('yyyy-MM-DD');
            var end = moment(time).add(1, 'days').format('yyyy-MM-DD');

            // console.log(start, end)
            ipc.send('sql', { folder: context.state.folder, sql: `select urls.url,datetime(visit_time / 1000000 + (strftime('%s', '1601-01-01')), 'unixepoch') as time,  title,from_visit, transition,visit_duration, visit_count,typed_count from visits,urls WHERE visits.url==urls.id and  time>'${start}' and time<'${end}'` }).then(res => {
                    var group = [];
                    var curgroup = [];
                    for (var item in res) {
                        if (curgroup.length == 0) {
                            curgroup.push(res[item]);
                        } else {
                            if (
                                moment(curgroup[curgroup.length - 1].time).diff(
                                    moment(res[item].time),
                                    "minute"
                                ) > -15
                            ) {
                                curgroup.push(res[item]);
                            } else {
                                group.push(curgroup);
                                curgroup = [];
                            }
                        }
                    }
                    context.commit("setgroup", group);
                    context.commit(
                        "sethistory",
                        res.sort(
                            (a, b) => moment(a.time) - moment(b.time)
                        )
                    );
                    context.commit("setloading", false);
                    // console.log(group)
                }).catch(res=>{
                  
                  // console.log()
                  if(res.message=='SQLITE_ERROR: no such table: visits'){
                    alert("选择的路径下没有数据库文件")
                  }else if(res.message=='SQLITE_BUSY: database is locked'){
                    alert("需要关闭您的chrome 浏览器")
                  }else if(res.message=='SQLITE_NOTADB: file is not a database'){
                    alert("选择了错误的chrome数据文件")
                    // var a=new Notification('Title', {
                    //   body: 'Lorem Ipsum Dolor Sit Amet'
                    // })
                    // a.ac
                  }
                  
                })
                // ipc.send('copydb','C:\\Users\\legen\\AppData\\Local\\Google\\Chrome\\User Data\\Default\\').then(()=>{
                //   ipc.send('sql',"select * from visits").then(res=>{
                //     console.log(res)
                //   })
                // })
                // if (!payload) {

            //   Vue.prototype
            //     .$get("http://localhost:18889/api/history/today")
            //     .then(res => {
            //       var group = [];
            //       var curgroup = [];
            //       for (var item in res) {
            //         if (curgroup.length == 0) {
            //           curgroup.push(res[item]);
            //         } else {
            //           if (
            //             moment(curgroup[curgroup.length - 1].visit.visitAt).diff(
            //               moment(res[item].visit.visitAt),
            //               "minute"
            //             ) > -15
            //           ) {
            //             curgroup.push(res[item]);
            //           } else {
            //             group.push(curgroup);
            //             curgroup = [];
            //           }
            //         }
            //       }

            //       context.commit("setgroup", group);
            //       context.commit(
            //         "sethistory",
            //         res.sort(
            //           (a, b) => moment(a.visit.visitAt) - moment(b.visit.visitAt)
            //         )
            //       );
            //       context.commit("setloading", false);
            //     });
            // } else {
            //   Vue.prototype
            //     .$get("http://localhost:18889/api/history/today?start=" + payload)
            //     .then(res => {
            //       var group = [];
            //       var curgroup = [];
            //       for (var item in res) {
            //         if (curgroup.length == 0) {
            //           curgroup.push(res[item]);
            //         } else {
            //           if (
            //             moment(curgroup[curgroup.length - 1].visit.visitAt).diff(
            //               moment(res[item].visit.visitAt),
            //               "minute"
            //             ) > -15
            //           ) {
            //             curgroup.push(res[item]);
            //           } else {
            //             group.push(curgroup);
            //             curgroup = [];
            //           }
            //         }
            //       }
            //       context.commit("setgroup", group);
            //       context.commit("sethistory", res);
            //       context.commit("setloading", false);
            //     });
            // }
        }
    },
    modules: {},
    plugins: [vuexLocal.plugin]
});