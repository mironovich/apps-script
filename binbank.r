# Конфигурация OTT
IDS <- 50715488
DIM <- "ga:date, ga:source, ga:campaign"
MET <- "ga:sessions, ga:newUsers, ga:goal4Completions, ga:goal5Completions"
FIL <- ""
STA <- "2017-06-01"
END <- "2017-08-31"
SEG <- "sessions::condition::ga:pagePath=@/landing/deposits/"

#Получаем данные из GA
binbank <- ga$getData(
  ids = IDS,
  batch = TRUE,
  walk = TRUE,
  start.date = STA,
  end.date = END,
  dimensions = DIM,
  metrics = MET,
  filters = FIL,
  segment = SEG
)

IDS <- 86994512
MET <- "ga:goal4Completions, ga:goal3Completions, ga:goal14Completions, ga:goal5Completions, ga:goal16Completions, ga:goal15Completions"

lp <- ga$getData(
  ids = IDS,
  batch = TRUE,
  walk = TRUE,
  start.date = STA,
  end.date = END,
  dimensions = DIM,
  metrics = MET,
  filters = FIL,
  segment = SEG
)

groupSources <- function(b) {
  for (i in 1:length(b$campaign)) {
    if (b$campaign[i] != 'deposits') {
      b$campaign[i] <- ''
    }
  }
  b <- aggregate(b[,4:ncol(b)], by = list(b$date, b$source, b$campaign), FUN = sum)
  for (i in 1:length(b[, 2])) {
    b[i, 2] <- gsub('(yandex_direct|google_adwords)+(_(s|rem|d|ret))?$', 'Контекст', b[i, 2])
    b[i, 2] <- gsub('yandex_auction$|doubleclick(_(m|add|3rd|rem|aud))?$', 'Аудиторные закупки', b[i, 2])
    b[i, 2] <- gsub('mytarget(_m)?$|^vk$|^fb$|^inst$', 'Социальные сети', b[i, 2])
    b[i, 2] <- gsub('.*sms.*', 'СМС', b[i, 2])
    b[i, 2] <- gsub('.*email.*', 'Email', b[i, 2])
    b[i, 2] <- gsub('^sravni$|^viberu$?', 'Фин.сектор', b[i, 2])
    if (b[i, 3] == 'deposits') {
      b[i, 2] <- gsub('^moneymatika$|^banki(ru)?$', 'Фин.сектор', b[i, 2])
    }
    b[i, 2] <- gsub('\\(direct\\)', 'Прямые переходы', b[i, 2])
    b[i, 2] <- gsub('binbankcards\\.ru', 'binbankcards.ru', b[i, 2])
    b[i, 2] <- gsub('^yandex_glav_(msk|spb|reg(_\\d)?)+$|^rbc$|^rambler_pmp$|^vedomosti$|^kommersant$|^rbc_mob$|^lenta$', 'Охватные ресурсы', b[i, 2])
    if (!grepl('Контекст|Аудиторные закупки|Социальные сети|СМС|Email|Фин\\.сектор|^2gis$|Прямые переходы|binbankcards\\.ru|Охватные ресурсы', b[i,2])) {
      b[i, 2] = 'Прочее'
    }
  }

  b <- aggregate(b[,4:ncol(b)], by = list(b[, 1], b[, 2]), FUN = sum)
  b <- b[order(b[, 1], b[, 3]), ]
  return(b)
}

df1 <- setNames(groupSources(binbank), c('date', 'source', 'sessions', 'new', 'goal4 binbank', 'goal5 binbank'))
df2 <- setNames(groupSources(lp), c('date', 'source', 'goal4', 'goal3', 'goal14', 'goal5', 'goal16', 'goal15'))

result <- merge(x=df1, y=df2, by.x = c('date', 'source'), by.y = c('date', 'source'))

write.table(result, "binbank.csv", sep = ";", row.names = FALSE, quote = FALSE)

#grepl('^yandex_glav_(msk|spb|reg(_\\d)?)+$|^rbc$|^rambler_pmp$|^vedomosti$|^kommersant$|^rbc_mob$|^lenta$', 'yandex_glav_reg_2')
#grepl('^yandex_glav_(msk|spb|reg(_\\d)?)+|^rbc$|^rambler_pmp$|^vedomosti$|^kommersant$|^rbc_mob$|^lenta$', 'rbc')
