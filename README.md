## 项目信息

- 项目简介：Aura 是一款专为慢性病患者设计的智能健康助手，致力于将繁琐的健康管理转化为简单、安心的日常陪伴。
- 运行平台：基于英特尔AI-PC，通过OpenVINO本地化部署通义千问（Qwen）大模型，确保所有个人健康信息在用户设备端处理。
- 详细说明见 <https://modelscope.cn/learn/2920>



## 运行条件

* 运行环境准备： 
    - 开发工具：Python , Mysql，Docker Desktop
    - 驱动安装：Nvdia GPU Driver& CUDA，Intel Core CPU Driver
* Docker镜像下载：
    - OpenVINO：openvino/model_server:latest-gpu（部分模型用weekly镜像）
    - Vllm：vllm/vllm-openai:latest
    - N8N：docker.n8n.io/n8nio/n8n
    - MySQL：mysql:latest
* 开源模型下载：
    - Qwen VL：OpenVINO/Qwen2-VL-7B-Instruct-int4-ov
    - Qwen：OpenVINO/Qwen3-0.6B-fp16-ov
    - Qwen Coder：Qwen/Qwen2.5-Coder-3B-Instruct-GPTQ-Int8
    - Whisper: OpenVINO/whisper-tiny-int4-ov



## 运行说明

* 安装Drivers和Docker Desktop后，下载开源模型，如下示例用modelscope下载Qwen2-VL：
```bash
modelscope download --model OpenVINO/Qwen2-VL-7B-Instruct-int4-ov --local_dir models/OpenVINO/Qwen2-VL-7B-Instruct-int4-ov
```
* 所需模型下载完成后，可将docker-compose.yml配置文件修改成本地目录和端口port，使用Docker Compose运行容器：
```bash
docker compose up
```
* 模型部署Docker运行成功后，可调用推理API进行测试与验证，如下示例是Qwen2-VL（OpenAI API协议）：
```bash
$body = @{
  model = "OpenVINO/Qwen2-VL-7B-Instruct-int4-ov"
  max_tokens = 512
  temperature = 0
  stream = $false
  messages = @(
    @{ role = "system"; content = "You are a helpful assistant." },
    @{
      role = "user"
      content = @(
        @{ type = "text"; text = "Describe this image in details." },
        @{ type = "image_url"; image_url = @{ url = "Your image URL" } }
      )
    }
  )
  chat_template_kwargs = @{ enable_thinking = $false }
} | ConvertTo-Json -Depth 10

$resp = Invoke-RestMethod -Uri "http://localhost:8002/v3/chat/completions" `
  -Method Post `
  -ContentType "application/json" `
  -Body $body

$resp.choices[0].message.content
```  
* MySQL Docker运行成功后，连接到mysql，创建如下的Database与数据表：
```bash
CREATE DATABASE reports_db;
USE reports_db;
 
CREATE TABLE medical_reports (
         id INT PRIMARY KEY AUTO_INCREMENT,
         report_name VARCHAR(200) NOT NULL COMMENT '',
         report_date VARCHAR(200) NOT NULL COMMENT '',
         report_summary TEXT COMMENT '',
         medical_instructions TEXT COMMENT '',
         medical_indications TEXT COMMENT '',
         medical_reminders TEXT COMMENT '',
         report_type ENUM('LAB_REPORT', 'MEDICINE', 'OTHER') );
```
* 访问 http://localhost:5678/ 配置N8N环境：1、配置模型和MySQL的密钥；2、创建并导入workflow文件；3、测试workflow是否正常运行。
* 最后部署本地Web服务，访问http://localhost:8000/ 即可使用 Aura 应用：
```bash
cd app
python -m http.server 8000
```




## 技术架构
<img src="架构图.png" alt="图片描述" width="720">



## 联系我们

- Aura 慢病健康助手是 re4.ai 的端侧AI开源项目，商业合作可联系邮箱：cartman.djw@gmail.com 
- 访问 <https://re4.ai/> 咨询端到端AI解决方案，帮助企业和创业团队通过人工智能技术解决实际问题。

