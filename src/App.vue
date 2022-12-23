<template>
  <div id="app">
  <div class="head_wrapper">
     <div id="head">
     <van-icon class="topPosition" name="arrow-left" />
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
        总投注
        <span>327.32</span>
      </div>
      <div>
        总输/赢
        <span>32(-50)</span>
      </div>
      <van-icon @click="changeArrowSow()" v-show="!showArrow" class="closeIcon" name="back-top" />
      <van-icon class="closeIcon"  @click="changeArrowSow()" v-show="showArrow" name="down" />
    </div>
  </div>

  <div id="main_table">
   
   <div class="table_main">
      <div class="table_head">注单号：20239943848458483</div>
        <div class="main_wrapper" >

        </div>
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
 <van-calendar  :min-date="minDate" :max-date="maxDate"  type="range" v-model="showDate"  @confirm="changeDate" :value="sureDate" :max-range="7"  />
  </div>
</template>

<script>
import moment from "moment";
export default {
  data() {
    return {
      showArrow: false,
      showPicker: false,
      showPickerRight: false,
      columns: ["ALL GAME", "Fishing", "Live", "Sports", "SLOT"],
      columnsRight: ["Today", "Yester day", "Past 7 day", "Period"],
      selectLeft: "ALL GAME",
      selectRight: "Today",
      sureDate: [],
      showDate: false,
      minDate: new Date(1900, 1, 1, 0, 0, 0),
      maxDate: new Date(2099, 12, 31, 59, 59, 59)
    };
  },
  mounted() {
    this.sureDate[0] = moment(new Date()).format("YYYY-MM-DD");
    this.sureDate[1] = moment(new Date()).format("YYYY-MM-DD");
  },
  methods: {
    changeArrowSow() {
      this.showArrow = !this.showArrow;
    },
    onConfirm(value) {
      this.selectLeft = value;
      this.showPicker = false;
    },
    openPopLeft() {
      this.showPicker = true;
    },
    openPopRight() {
      this.showPickerRight = true;
    },
    onConfirmRight(value) {
      this.selectRight = value;
      this.showPickerRight = false;
    },
    changeDate(value) {
      this.sureDate[0] = moment(value[0]).format("YYYY-MM-DD");
      this.sureDate[1] = moment(value[1]).format("YYYY-MM-DD");
      this.showDate = false;
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
  height: 64px;
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
  width: 100px;
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
}
.table_main {
  border: 1px solid #36095c;
}
.main_wrapper {
  padding: 20px;
}
</style>
