<template>
  <div id="app">
  <div class="head_wrapper">
     <div id="head">
     <van-icon @click="closePage()" class="topPosition" name="arrow-left" />
      History 
    </div>
    <div class="nav_list">
      <div @click="openPopLeft">{{selectLeft}} <van-icon name="arrow-down" /></div>
      <div  @click="openPopRight">{{selectRight}} <van-icon name="arrow-down" /></div>
    </div>
    <div v-show="selectRight=='Period'" class="period">
      <div>Start  <span @click="showDate=true">{{sureDate[0]}}</span> </div>
      <div>End  <span @click="showDate=true">{{sureDate[1]}} </span> </div>
    </div>
    <div :class="['all_info',{'height-20px':showArrow}]">
      <div>
        Total Bets
        <span >{{betScoreSum}}</span>
      </div>
      <!-- <div>
        总输赢
        <span>32(-50)</span>
      </div> -->
      <van-icon @click="changeArrowSow()" v-show="!showArrow" class="closeIcon" name="back-top" />
      <van-icon class="closeIcon"  @click="changeArrowSow()" v-show="showArrow" name="down" />
    </div>
  </div>

  <div id="main_table">
   
   <div v-for="(v,i) in tableData" :key="i" class="table_main">
      <div class="table_head">Txn.ID &emsp; {{v.OrderID}}</div>
        <div class="main_wrapper" >
          <!-- {{$t('100001')}} -->
          <div class="left_data">
            <div>{{v.BetTime}}</div>
            <div class="platform">{{columnsData[v.LogType]}}<div> |</div> {{v.Platform}}</div>
            <div>{{$t(v.ServerID)}}</div>
            <div style="margin-bottom:0">BET：{{v.BetScore}}</div>
          </div>
          <div class="right_data">
            <div>
              <van-button size="small" color="#7232dd">{{v.StatusName}}</van-button>
            </div>
            <div v-if="v.WinScore!==0 && v.Status==5"  class="BetScore">
              {{v.WinScore}}
            </div>
             <div v-if="v.WinScore==0 && v.Status==5"  class="BetScoreLoss">
              -{{v.BetScore}}
            </div>
          </div>
        </div>
   </div>
  <div v-if="tableData.length==0" class="noinfo">
    <img src="./assets/no.png" alt="">
  </div>
  <div  v-if="tableData.length!==0">
<van-pagination v-model="currentPage" @change="pageChange" :total-items="total" :items-per-page="50"  mode="simple" />
  </div>


  </div>
  <van-popup v-model="showPicker" round position="bottom">
  <van-picker
    show-toolbar
    :columns="columns"
    @cancel="showPicker = false"
    @confirm="onConfirm"
  />
</van-popup>

  <van-popup v-model="showPickerRight" round position="bottom">
  <van-picker
    show-toolbar
    :columns="columnsRight"
    @cancel="showPickerRight = false"
    @confirm="onConfirmRight"
  />
</van-popup>
 <van-calendar  
 :min-date="minDate"  
 :max-date="maxDate"  
 type="range" 
 v-model="showDate"  
 @confirm="changeDate" 
 :value="sureDate" 
 :max-range="7"  />

 <van-overlay :show="show" >
<div class="loading_mask">
   <van-loading color="#990066" size="30px"  text-size="30px">Loading...</van-loading>
</div>
</van-overlay>
  </div>
</template>

<script>
import moment from "moment";
import { getList, recordSum } from "./api/index.js";
export default {
  data() {
    return {
      showArrow: false,
      showPicker: false,
      showPickerRight: false,
      columns: [
        "ALL-GAME",
        "FH",
        "TABLE",
        "LIVE",
        "SPORTS",
        "OTHER",
        "Board game",
        "SOLT"
      ],
      columnsRight: ["Today", "Yesterday", "Past 7 day", "Period"],
      selectLeft: "ALL GAME",
      selectRight: "Today",
      sureDate: [],
      showDate: false,
      minDate: new Date(),
      maxDate: new Date(),
      betScoreSum: 0,
      dataColumns: {
        "ALL-GAME": "-1",
        FH: "0",
        TABLE: "4",
        LIVE: "10",
        SPORTS: "11",
        OTHER: "2",
        "Board game": "3",
        SOLT: "1"
      },
      columnsData: {
        "0": "FH",
        "4": "TABLE",
        "10": "LIVE",

        "11": "SPORTS",
        "2": "OTHER",
        "3": "Board game",
        "1": "SOLT"
      },
      currentPage: 1,
      tableData: [],
      show: false,
      total: 0,
      userId: ""
      // servePlatform:''
    };
  },
  mounted() {
    location.href = "uniwebview://OnOpenWebView";
    this.userId = location.search.split("=")[1];
    const end = new Date();
    const start = new Date();
    end.setTime(start.getTime());
    this.minDate = new Date(
      moment(start.getTime() - 3600 * 1000 * 24 * 6).format("YYYY-MM-DD")
    );
    this.maxDate = new Date(
      moment(start.getTime() + 3600 * 1000 * 24 * 6).format("YYYY-MM-DD")
    );
    this.sureDate.push(moment(start).format("YYYY-MM-DD"));

    this.sureDate.push(moment(end).format("YYYY-MM-DD"));
    this.getData(1);
    this.getTotalData();
  },
  methods: {
    getData(e) {
      this.show = true;
      this.tableData = [];
      getList({
        page: e,
        per_page: 50,
        user_id: this.userId,
        gt: this.dataColumns[this.selectLeft],
        date_start: this.sureDate[0],
        date_end: this.sureDate[1]
      })
        .then(res => {
          if (res.data.code == 200) {
            for (let v of res.data.data.data) {
              v.BetTime = moment(v.BetTime).format("YYYY-MM-DD HH:mm:ss");
            }
            this.total = res.data.data.total;
            this.tableData = res.data.data.data;
            this.show = false;
          } else {
            this.show = false;
            this.$toast.fail(res.data.msg);
          }
        })
        .catch(err => {
          this.show = false;
          console.log(err);
        });
    },
    changeArrowSow() {
      this.showArrow = !this.showArrow;
    },
    onConfirm(value) {
      this.selectLeft = value;
      this.getData(1);
      this.getTotalData();
      this.showPicker = false;
    },
    openPopLeft() {
      this.showPicker = true;
    },
    openPopRight() {
      this.showPickerRight = true;
    },
    getTotalData() {
      recordSum({
        user_id: this.userId,
        gt: this.dataColumns[this.selectLeft],
        date_start: this.sureDate[0],
        date_end: this.sureDate[1]
      })
        .then(res => {
          if (res.data.code == 200) {
            this.betScoreSum = res.data.data.betScoreSum;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    onConfirmRight(value) {
      this.selectRight = value;
      this.showPickerRight = false;
      if (value !== "Period") {
        if (value == "Yesterday") {
          this.sureDate = [];
          const end = new Date();
          const start = new Date();
          start.setTime(start.getTime() - 3600 * 1000 * 24);
          end.setTime(end.getTime() - 3600 * 1000 * 24);
          this.sureDate.push(moment(start).format("YYYY-MM-DD"));
          this.sureDate.push(moment(end).format("YYYY-MM-DD"));
          this.currentPage = 1;
          this.getData(1);
          this.getTotalData();
        } else if (value == "Past 7 day") {
          this.sureDate = [];
          const end = new Date();
          const start = new Date();
          start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
          this.sureDate.push(moment(start).format("YYYY-MM-DD"));
          this.sureDate.push(moment(end).format("YYYY-MM-DD"));
          this.currentPage = 1;
          this.getData(1);
          this.getTotalData();
        } else if (value == "Today") {
          this.sureDate = [];
          const end = new Date();
          const start = new Date();
          end.setTime(start.getTime());
          this.sureDate.push(moment(start).format("YYYY-MM-DD"));
          this.currentPage = 1;
          this.sureDate.push(moment(end).format("YYYY-MM-DD"));
          this.getData(1);
          this.getTotalData();
        }
      }
    },
    changeDate(value) {
      this.sureDate[0] = moment(value[0]).format("YYYY-MM-DD");
      this.sureDate[1] = moment(value[1]).format("YYYY-MM-DD");
      this.showDate = false;
      this.currentPage = 1;
      this.getData(1);
      this.getTotalData();
    },
    pageChange(e) {
      this.currentPage = e;
      this.getData(e);
    },
    closePage() {
      location.href = "uniwebview://close";
    }
  }
};
</script>

<style>
#app {
  background: #4a137a;
  width: 100vw;
  min-height: 100vh;
}
#head {
  height: 60px;
  line-height: 60px;
  font-size: 24px;
  font-weight: 600;
  text-align: center;
  position: relative;
  background: #36095c;
  color: #fff;
}
.topPosition {
  position: absolute !important;
  left: 10px;
  top: 16px;
  font-size: 30px !important;
}
.all_info {
  background: #4a137a;
  color: #ffffff;
  padding: 20px 20px 20px;
  border-bottom: 2px solid #36095c;
  position: relative;
  overflow: hidden;
  transition: all 0.5s;
}
.all_info > div {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}
.closeIcon {
  position: absolute !important;
  bottom: 4px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 26px !important;
}
.height-20px {
  height: 0px !important;
  padding: 0 !important;
  padding-top: 30px !important;
}
.arrow-bottom {
  transform: translate3d(90edg) !important;
}
.nav_list {
  height: 40px;
  border-bottom: 2px solid #36095c;
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #ffffff;
}
.nav_list > div {
  width: 120px;
  display: flex;
  justify-content: space-between;
}
.period {
  padding: 0 20px;
  border-bottom: 2px solid #36095c;
}
.period > div {
  height: 30px;
  line-height: 30px;
  color: #fff;
  display: flex;
  justify-content: space-between;
}
#main_table {
  padding: 20px;
}
.table_head {
  height: 40px;
  line-height: 40px;
  background: #36095c;
  text-align: center;
  color: #fff;
  font-weight: 600;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  padding: 0 20px;
}
.table_main {
  border: 1px solid #36095c;
  margin-bottom: 20px;
}
.main_wrapper {
  padding: 20px;
  display: flex;
  justify-content: space-between;
}
.left_data > div {
  font-size: 14px;
  color: #fff;
  font-weight: 400;
  margin-bottom: 10px;
}
.right_data {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: space-between;
}
.BetScore {
  font-size: 20px;
  font-weight: 600;
  color: #07c160;
}
.van-pagination__item--disabled,
.van-pagination__item--disabled:active {
  background-color: #36095c !important;
}
.van-pagination__item:active {
  background: transparent !important;
}
.van-pagination__page-desc {
  color: #fff !important;
}
.van-pagination__item {
  color: #fff !important;
  background: transparent !important;
}
.noinfo {
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: 20px;
}
.noinfo > img {
  width: 100%;
  margin-bottom: 40px;
}
.loading_mask {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.BetScoreLoss {
  font-size: 20px;
  font-weight: 600;
  color: #ff0033;
}
.platform {
  display: flex;
  align-items: center;
}
.platform > div {
  margin: 0 6px;
  padding-bottom: 2px;
}
</style>
