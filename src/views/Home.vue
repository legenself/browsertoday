<template>
  <v-container fluid>
      <v-app-bar app dark flat color="blue-grey"  dense>
        <v-btn id='step1' @click="selectfolder" text v-if="folder">已选择数据库文件 {{folder}}</v-btn>
         <v-btn id='step1' @click="selectfolder" text v-else>选择文件夹</v-btn>
         <v-spacer/>
         <v-btn text @click="help">
           <v-icon left small class="mr-1" >fa-question</v-icon>
           帮助</v-btn>
      </v-app-bar>
    <v-navigation-drawer width="320" dark app permanent>
    
      <v-row justify="center" class="pa-5">
        <v-date-picker id='step2'
          color="blue-grey"
          v-model="now"
          @change="changedate"
          no-title
          scrollable
        ></v-date-picker>
      </v-row>
      <v-list-item two-line>
        <v-list-item-content>
          <v-list-item-title
            >访问 {{ group.length }} 组
            {{ history.length }} 个网页</v-list-item-title
          >
          <v-list-item-subtitle></v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
      <v-sheet
        v-if="group.length != 0"
        class="ma-5 mx-auto"
        color="blue-grey"
        rounded
        max-width="calc(100% - 64px)"
        elevation="2"
      >
        <v-sparkline id='step3'
          color="rgba(255, 255, 255, .7)"
          gradients="#eee"
          smooth
          line-width="10"
          :labels="historyhist.label"
          :value="historyhist.value"
          fill
          auto-draw
        ></v-sparkline>
      </v-sheet>
    </v-navigation-drawer>
    <v-row no-gutters>
      <v-col cols="12">
        <v-expansion-panels dense>
          <v-expansion-panel v-for="(item, index) in group" :key="index">
            <v-expansion-panel-header
              class="  text-left"
              :class="{ 'blue-grey--text': sum(item) > 100 }"
            >
              {{ item[0].time | fromnow }} {{ item[0].title }}
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-list dense>
                <v-list-item
                  class="text-left"
                  v-for="(i, index) in item"
                  :key="index"
                >
                  <v-list-item-content>
                    <v-list-item-title>
                      <v-btn text :href="i.url" target="_blank"
                        >{{ i.time | fromnow }}
                        {{
                          i.title.length == 0 ? "无标题" : i.title
                        }}</v-btn
                      >
                    </v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-col>
    </v-row>
        <v-tour name="helper" :steps="steps" :options='options'></v-tour>
  </v-container>
</template>

<script>
// @ is an alias to /src
// import db from '@/plugins/db.js'
import sq3 from 'sqlite3';
import moment from "moment";
import "moment/locale/zh-cn"
import { mapActions, mapState } from "vuex";
export default {
  name: "Home",

  data() {
    return {
      options:{
        highlight: true,
         labels: {
                buttonSkip: '跳过',
                buttonPrevious: '上一步',
                buttonNext: '下一步',
                buttonStop: '关闭'
            }
      },
      steps:[
        {
          target:"#step1",
          header:{
            title:"点击选择google chrome的数据库文件"
          },
          content:"一般在 C:\\Users\\你的用户名\\AppData\\Local\\Google\\Chrome\\User Data\\Default\\ 下的 History文件"
        },
        {
          target:"#step2",
          content:"选择日期，查看每一天干了什么"
        }
      ],
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      },
      now: ""
    };
  },
  mounted() { 

    // db.all("select * from test",function(err,res){
    //   if(!err){
    //     console.log(JSON.stringify(res));
    //   }
    //   else{
    //     console.log(err);
    //   }
    // });
     console.log(new (sq3.verbose().Database)("C://a.db"))
    this.fetchhistory(this.now);
  },
  filters: {
    fromnow(x) {
      if (!x) {
        return "";
      }
      return moment(x).format("LT");
    }
  },
  computed: {
    ...mapState(["history", "group",'folder']),
    historyhist() {
      var label = this.group.map(p => moment(p[0].time).hour());
      var value = this.group.map(p => p.length);

      return { label, value };
    }
  },
  methods: {
    ...mapActions(["fetchhistory", "setfolder"]),
    help(){
      this.$tours['helper'].start()
    },
    selectfolder() {
      this.setfolder();
    },
    changedate() {
    //  new Notification({ body: 'Lorem Ipsum Dolor Sit Amet'}).show()
      // console.log(this.now)
      // this.fetchhistory('select * from visits');
      this.fetchhistory(this.now);
    },
    sum(arr) {
      var s = 0;
      for (var i = arr.length - 1; i >= 0; i--) {
        s += arr[i].url.visitCount;
      }
      return s;
    }
  }
};
</script>
 