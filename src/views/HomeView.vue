<template>
  <div class="pa-7">

  </div>  
</template>

<script>

  export default {
    name: 'HomeView',
    components: {
      //
    },
  }
</script>

<style scoped>
p.speech {
position: relative;
    width: 165px;
    /* height: 94px; */
    text-align: center;
    /* line-height: 100px; */
    background-color: #fff;
    border: 2px solid #666;
    border-radius: 30px;
    box-shadow: 2px 2px 4px #888;
}
p.speech:before { 
content: ' ';
    position: absolute;
    width: 0;
    height: 0;
    left: 30px;
    top: 49px;
    border: 11px solid;
    border-color: #666 transparent transparent #666;
}
p.speech:after { 
    content: ' ';
    position: absolute;
    width: 0;
    height: 0;
    left: 32px;
    top: 48px;
    border: 8px solid;
    border-color: #fff transparent transparent #fff;
}
</style>