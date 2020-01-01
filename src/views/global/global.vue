<template>
  <div></div>
</template>

<script>
// const Url = "https://nfys.kinglian.cn/nfysH5";
const Url = "https://nfys-test.kinglian.cn/nfysH5";

/*调用app的toast
*@content 显示的内容
*/
function showToast(content) {
  JsBridge.callMethod(
    "JsInvokeNativeMethod",
    "showToast",
    { message: "消息提示", toast: content },
    function(data) {}
  );
}
export default {
  Url,
  showToast
};
</script>
