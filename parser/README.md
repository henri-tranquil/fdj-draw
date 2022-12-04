# Prerequire

## Installation
```shell
sh scripts/install.sh
```

---

## Environement variable
### DISCORD_HOOK :
```shell
export DISCORD_HOOK=url-of-hook.com
```

---

## Crontab
### Show current cron task :
```shell
crontab -l
```

### Add new task every day at 22h :
```shell
cd scripts
crontab cron-file
```

### remove cron task :
```shell
crontab -r
```

---