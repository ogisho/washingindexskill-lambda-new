# Lambda Node.js 18 base image
FROM public.ecr.aws/lambda/nodejs:18

# Puppeteer用に必要なパッケージを事前インストール
RUN yum install -y \
    atk \
    cups-libs \
    gtk3 \
    libXcomposite \
    libXcursor \
    libXdamage \
    libXext \
    libXi \
    libXrandr \
    libXScrnSaver \
    libXtst \
    pango \
    alsa-lib \
    ipa-gothic-fonts \
    xorg-x11-fonts-Type1 \
    xorg-x11-fonts-misc \
    && yum clean all

# PuppeteerはNode.js依存なのでpackage.json管理
# プロジェクトフォルダに合わせて置き換えてね
COPY package*.json ./

# 必ず--legacy-peer-depsで依存関係解決
RUN npm install --legacy-peer-deps

# プロジェクトコードを全てコピー
COPY . .

# Lambdaのエントリポイント
# index.js内のhandler関数を呼ぶ場合
CMD [ "index.handler" ]FROM public.ecr.aws/lambda/nodejs:18

RUN yum install -y \
    atk \
    cups-libs \
    gtk3 \
    ipa-gothic-fonts \
    xorg-x11-server-Xvfb \
    libXcomposite \
    libXcursor \
    libXdamage \
    libXext \
    libXi \
    libXrandr \
    libXScrnSaver \
    libXtst \
    pango \
    alsa-lib

COPY . ${LAMBDA_TASK_ROOT}

CMD [ "index.handler" ]
