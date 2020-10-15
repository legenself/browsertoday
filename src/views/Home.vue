<template>
  <v-container fluid>
    <v-navigation-drawer width="320" dark app permanent>
      <v-toolbar class="transparent" flat>
              <v-btn @click="selectfolder">选择文件夹</v-btn>
      </v-toolbar>
      <v-row justify="center" class="pa-5">
        <v-date-picker
          color="teal"
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
        color="teal"
        rounded
        max-width="calc(100% - 64px)"
        elevation="2"
      >
        <v-sparkline
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
              :class="{ 'teal--text': sum(item) > 100 }"
            >
              {{ item[0].visit.visitAt | fromnow }} {{ item[0].url.title }}
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
                      <v-btn text :href="i.url.url" target="_blank"
                        >{{ i.visit.visitAt | fromnow }}
                        {{
                          i.url.title.length == 0 ? "无标题" : i.url.title
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
  </v-container>
</template>

<script>
// @ is an alias to /src
// import db from '@/plugins/db.js'

import moment from "moment";
import { mapActions, mapState } from "vuex";
export default {
  name: "Home",

  data() {
    return {
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
    // moment.locale("zh-cn");
  
    // db.all("select * from test",function(err,res){
    //   if(!err){
    //     console.log(JSON.stringify(res));
    //   }
    //   else{
    //     console.log(err);
    //   }
    // });
    this.fetchhistory();
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
    ...mapState(["history", "group"]),
    historyhist() {
      var label = this.group.map(p => moment(p[0].visit.visitAt).hour());
      var value = this.group.map(p => p.length);

      return { label, value };
    }
  },
  methods: {
    ...mapActions(["fetchhistory",'setfolder']),
    selectfolder(){
      this.setfolder()
    },
    changedate() {
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
