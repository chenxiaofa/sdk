<?php
/**
 * 珠海魅族科技有限公司
 * Copyright (c) 2012 - 2013 meizu.com ZhuHai Inc. (http://www.meizu.com)
 * User: 陈晓发
 * Date: 2016/3/31
 * Time: 17:28
 */

$timestamp	= time();
$nonce		= rand(100000000,999999999);
$secretKey 	= '202cb962ac59075b964b07152d234b70';
$appId 		= '1';

$authData  = [$timestamp,$nonce,$secretKey,$appId];
sort($authData,SORT_STRING);

$signature = md5(implode('',$authData));

?>

<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>Title</title>
</head>
<body>
</body>
<script src="/js-sdk/web_push.js"></script>
<script>
	WebPush.debug(true);
	var wp = new WebPush(
		{
			data_type:'json',
			app_id:1,
			timestamp:'<?php echo $timestamp?>',
			nonce:'<?php echo $nonce?>',
			signature:'<?php echo $signature?>'
		}
	);
	wp.on('register',
		function(sessionId)
		{
			document.querySelectorAll('body')[0].innerHTML = sessionId;
		}
	);
	wp.on('message',
		function(message)
		{
			document.querySelectorAll('body')[0].innerHTML += '<br>' + message;
		}
	);
	wp.connect();

</script>
<script type="text/javascript" src="http://tajs.qq.com/stats?sId=55546702" charset="UTF-8"></script>
</html>
