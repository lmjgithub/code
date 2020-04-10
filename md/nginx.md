# nginx

## 负载均衡
### 轮询
```nginx
upstream backserver {
    server 192.168.0.1;
    server 192.168.0.2;
}
```

### 权重weight
指定不同ip的权重，权重与访问比成正相关，权重越高，访问越大，适用于不同性能的机器
```
upstream backserver {
    server 192.168.0.1 weight=2;
    server 192.168.0.2 weight=8;
}
```

### 响应时间来分配
公平竞争，谁相应快，谁处理，不过这种方式需要依赖到第三方插件`nginx-upstream-fair`，需要先安装
```nginx
upstream backserver {
    server 192.168.0.1;
    server 192.168.0.2;
    fair;
}
```

## 健康检查
Nginx 自带 `ngx_http_upstream_module`（健康检测模块）本质上服务器心跳的检查，通过定期轮询向集群里的服务器发送健康检查请求,来检查集群中是否有服务器处于异常状态。
如果检测出其中某台服务器异常,那么在通过客户端请求nginx反向代理进来的都不会被发送到该服务器上（直至下次轮训健康检查正常）
```nginx
upstream backserver{
    server 192.168.0.1  max_fails=1 fail_timeout=40s;
    server 192.168.0.2  max_fails=1 fail_timeout=40s;
}
```
- `fail_timeout`: 设定服务器被认为不可用的时间段以及统计失败尝试次数的时间段，默认为10s;
- `max_fails`: 设定Nginx与服务器通信的尝试失败的次数，默认为：1次、

## 反向代理
反向代理指的是，当一个客户端发送的请求,想要访问服务器上的内容，但将被该请求先发送到一个代理服务器proxy,这个代理服务器（Nginx）将把请求代理到和自己属于同一个局域网下的内部服务器上,而用户通过客户端真正想获得的内容就存储在这些内部服务器上，此时Nginx代理服务器承担的角色就是一个中间人，起到分配和沟通的作用。

## Https 配置
### 签署第三方可信任的 SSL
### Nginx配置https
```nginx
server {
   #ssl参数
   listen              443 ssl; //监听443端口，因为443端口是https的默认端口。80为http的默认端口
   server_name         example.com;
   #证书文件（ssl_certificate：证书的绝对路径）
   ssl_certificate     example.com.crt;
   #私钥文件（ssl_certificate_key: 密钥的绝对路径）
   ssl_certificate_key example.com.key;
}
```

## IP白名单
配置nginx的白名单，规定有哪些ip可以访问你的服务器，防爬虫必备
```nginx
 server {
        location / {
                deny  192.168.0.1; // 禁止该ip访问
                deny  all; // 禁止所有
            }
  }
```

## 适配PC与移动环境
当用户从移动端打开PC端baidu.com的场景时，将自动跳至移动端m.baidu.com，本质上是Nginx可以通过内置变量$http_user_agent，获取到请求客户端的userAgent，从而知道当前用户当前终端是移动端还是PC，进而重定向到H5站还是PC站
```nginx
server {
 location / {
        //移动、pc设备agent获取
        if ($http_user_agent ~* '(Android|webOS|iPhone)') {
            set $mobile_request '1';
        }
        if ($mobile_request = '1') {
            rewrite ^.+ http://m.baidu.com;
        }
    }
}
```

## 配置gzip
```nginx
server{
    gzip on; //启动
    gzip_buffers 32 4K;
    gzip_comp_level 6; //压缩级别，1-10，数字越大压缩的越好
    gzip_min_length 100; //不压缩临界值，大于100的才压缩，一般不用改
    gzip_types application/javascript text/css text/xml;
    gzip_disable "MSIE [1-6]\."; // IE6对Gzip不友好，对Gzip
    gzip_vary on;
}
```

## Nginx配置跨域请求
```nginx

location / {
    add_header Access-Control-Allow-Origin *;
    add_header Access-Control-Allow-Methods 'GET, POST, OPTIONS';
    add_header Access-Control-Allow-Headers 'DNT,X-Mx-ReqToken,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Authorization';

    if ($request_method = 'OPTIONS') {
        return 204;
    }
}
```