<template>
  <CommonModal class="alert_main">
    <div slot="header">
      <b class="title">{{ title }}</b> 을(를) {{ confirm }}하시겠어요??
    </div>
    <div slot="body" class="body">
      <button class="primary-btn" @click="$emit('onagree')">
        네
      </button>
      <button class="primary-btn red" @click="$emit('ondisagree')">
        아니오
      </button>
    </div>
    <div slot="footer"></div>
  </CommonModal>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      required: true
    },
    confirm: {
      type: String,
      required: true
    }
  }
}
</script>

<style>
.modal-mask.alert_main{
  background-color:rgba(0,0,0,0.6);
}
.modal-mask.alert_main .title{word-break: break-all;}
.modal-mask.alert_main .modal-container{width: 700px; height: auto; border-radius: 5px; padding: 15px;}
.modal-mask.alert_main .body{text-align: center;}
.modal-mask.alert_main .body button{border-radius: 9px;}
@media (max-width:900px) {
.modal-mask.alert_main .modal-container{width: 60%;}
.modal-mask.alert_main .modal-body{margin: 0; padding: 10px 0;}
}
@media (max-width:600px) {
.modal-mask.alert_main .modal-container{width: 85%;}
.modal-mask.alert_main .primary-btn{display: block; width: 100%;}
}
</style>
