/**
 * Created by xiaofa on 2016/1/29.
 */
(
	function(global)
	{
		function isHttps()
		{
			return /^https/.test(window.location.protocol);
		}
		var console = global.console;
		console = {log:function(){}};
		const TYPE_REGISTER = 0;
		const TYPE_MESSAGE = 1;
		var _webPush = function(config)
		{
			config = config || {};
			this.config = {
				'host': config.host || 'ws.xfa-dev.cn',
				'port': config.port || (isHttps()?'443':'80'),
				'app_id': config.app_id || 0,
				'timestamp':config.timestamp || 0,
				'signature':config.signature || '',
				'nonce':config.nonce || 0,
				'channel': config.channel || [],
				'tag': config.tag || [],
				'data_type':config.data_type || 'string'
			};

			if ( !this.config.app_id )
			{
				throw new Error('invalid app id');
			}
		};
		_webPush.prototype.sessionID = '';
		_webPush.prototype.getWsUrl = function()
		{
			var protocol = 'ws';
			if ( isHttps() )
			{
				protocol = 'wss';
			}
			return protocol+'://%host%:%port%/%uri%?timestamp=%timestamp%&nonce=%nonce%&signature=%signature%'
							.replace('%host%',this.config.host)
							.replace('%port%',this.config.port)
							.replace('%uri%',this.config.app_id)
							.replace('%timestamp%',this.config.timestamp)
							.replace('%nonce%',this.config.nonce)
							.replace('%signature%',this.config.signature)
		};

		_webPush.prototype.onOpen = function(e)
		{
			console.log(e)
		};
		_webPush.prototype.onRegister = function(sessionId)
		{
			this.sessionID = sessionId;
			return this._onRegister(sessionId);
		};
		_webPush.prototype.onMessage = function(message)
		{
			if (this.config.data_type == 'json')
			{
				try
				{
					message = JSON.parse(message)
				}
				catch(e)
				{

				}
			}
			return this._onMessage.call(this,message);
		};
		_webPush.prototype.onRecv = function(event)
		{
			console.log(event);
			try
			{
				var e = JSON.parse(event.data);
				switch(parseInt(e.type,10))
				{
					case TYPE_REGISTER:
						return this.onRegister(e.data);
					case TYPE_MESSAGE:
						return this.onMessage(e.data);
				}
			}catch($e)
			{
				console.log($e)
			}
		};
		_webPush.prototype._onMessage = function(msg)
		{
			console.log(msg)
		};
		_webPush.prototype._onRegister = function(sessionId)
		{
			console.log(msg)
		};
		_webPush.prototype.setOnMessage = function(callback)
		{
			this._onMessage = callback;
		};

		_webPush.prototype.setOnRegister = function(callback)
		{
			this._onRegister = callback;
		};

		_webPush.prototype.connect = function()
		{
			var socket = new WebSocket(this.getWsUrl());
			var self = this;
			socket.onopen = this.onOpen;
			socket.onmessage = function(e)
			{
				self.onRecv.call(self,e);
			};
			socket.onerror = function()
			{
				console.log(arguments)
			}
		};
		global.WebPush = function(config)
		{
			var _wp = new _webPush(config);
			this.getSessionID = function()
			{
				return _wp.sessionID;
			};
			this.connect = function()
			{
				return _wp.connect();
			};
			this.on = function(type,callback)
			{
				switch (type)
				{
					case 'message':
						return _wp.setOnMessage(callback);
					case 'register':
						return _wp.setOnRegister(callback);

				}
			}
		};
		global.WebPush.debug = function(flag)
		{
			if (flag)
			{
				console = global.console;
			}
			else
			{
				console = {log:function(){}};
			}
		}

	}
)(window);