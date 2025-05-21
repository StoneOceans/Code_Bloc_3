# webserver/Dockerfile

# --- Étape 1: Build de l'application Frontend ---
    FROM node:18-alpine AS frontend_builder
    LABEL stage=frontend-builder
    
    WORKDIR /
    
    # 1) Copier uniquement package*.json pour profiter du cache
    COPY frontend/package*.json ./
    
    # 2) Installer les dépendances
    RUN npm install --legacy-peer-deps
    
    # 3) Copier tout le code frontend dans /app
    COPY frontend/. ./
    
    # 4) Lancer le build du front
    RUN npm run build
    
    
    # --- Étape 2: Configuration du serveur Apache ---
      FROM httpd:2.4-alpine

      # Copy your vhost config
      COPY webserver/my-site.conf /usr/local/apache2/conf/extra/my-site.conf
      
      # Inject a ServerName and Include the vhost
      RUN printf '\nServerName localhost\nInclude conf/extra/my-site.conf\n' \
            >> /usr/local/apache2/conf/httpd.conf && \
          sed -i \
            -e 's/^#\(LoadModule .*mod_proxy.so\)/\1/' \
            -e 's/^#\(LoadModule .*mod_proxy_http.so\)/\1/' \
            -e 's/^#\(LoadModule .*mod_rewrite.so\)/\1/' \
            -e 's/^#\(LoadModule .*mod_alias.so\)/\1/' \
            -e 's/^#\(LoadModule .*mod_headers.so\)/\1/' \
            /usr/local/apache2/conf/httpd.conf
      
      EXPOSE 80
      