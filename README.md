# Aura 慢病健康助手 aura-self-host-health-assistant
项目简介：Aura 是一款专为慢性病患者设计的智能健康助手，致力于将繁琐的健康管理转化为简单、安心的日常陪伴。
运行平台：基于英特尔AI-PC，通过本地化部署通义千问（Qwen）大模型，确保所有个人健康信息在用户设备端处理。


# 技术架构
<img width="2284" height="1310" alt="whiteboard_exported_image (2)" src="https://github.com/user-attachments/assets/57342dfd-294e-4048-9907-8667363a01dc" />

OpenVINO部署 Qwen2-VL-7B
- 下载模型
modelscope download --model OpenVINO/Qwen2-VL-7B-Instruct-int4-ov --local_dir models/OpenVINO/Qwen2-VL-7B-Instruct-int4-ov
- 启动容器
docker run -p 8002:8000 -v "D:\cursor-project\models:/models:rw" -e OMP_NUM_THREADS=4 -e OPENVINO_NUM_STREAMS=1 -e OPENVINO_LOG_LEVEL=INFO --rm --cpuset-cpus="0-6" --memory=14g --memory-swap=16g openvino/model_server:latest-gpu --source_model OpenVINO/Qwen2-VL-7B-Instruct-int4-ov --model_repository_path models --task text_generation --target_device CPU --rest_port 8000 --cache_size 2
  
