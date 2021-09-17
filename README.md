## 掘金爬虫

- 如果有些数据需要注册登录才能获取的话，自己处理登录（cookie，session,token）（让爬虫自己登录，用户名和密码给他让他登录抓取）
- 如果说登录时有验证码如何处理？
- 获取回来的数据有可能需要接推荐系统，清理数据
- 有些服务器会有反爬的功能。所以我们要控制请求的频率。需要频繁换 IP。（IP 池）
- 还要取 mock Agent
- 有些网站是客户端渲染。
- puppeteer 做爬虫，进行 UI 测试



这个仓库是 ep31 的源代码。

# 文件介绍

- hello_scraper.js - 使用 Puppeteer 爬取 bilibili 2020 年度翻唱区的热门视频。
- analysis.py - Python 脚本用于分析出现最频繁的词汇并生成词云图。

# 环境配置

- 若没有安装 Node.js 运行时，请下载安装：https://nodejs.org/
- 安装关联: `npm i`

# 运行爬虫脚本

- 使用 `node hello_scraper.js` 运行爬虫脚本
- 生成的数据将保存在 `data.json` 文件下

# 生成词云图

- 使用 `pip install jieba wordcloud pillow` 安装关联
- `python analysis.py`
- 生成的词云图将保存为 `word-cloud.png`
