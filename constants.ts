import { RegionData, Subject } from './types';

export const REGIONS: RegionData[] = [
  {
    name: "Andijon viloyati",
    districts: ["Andijon", "Asaka", "Baliqchi", "Bo‘z (Bo‘ston)", "Buloqboshi", "Izboskan", "Jalolquduq", "Jalaquduq", "Marhamat", "Oltinko‘l", "Paxtaobod", "Shahrixon", "Ulug‘nor", "Xo‘jaobod", "Qo‘rg‘ontepa"]
  },
  {
    name: "Buxoro viloyati",
    districts: ["Buxoro", "Vobkent", "Jondor", "Kogon", "Olot", "Peshku", "Romitan", "Shofirkon", "Qorovulbozor", "Qorako‘l", "G‘ijduvon"]
  },
  {
    name: "Farg‘ona viloyati",
    districts: ["Bag‘dod", "Beshariq", "Buvayda", "Dang‘ara", "Furqat", "Oltiariq", "Oxunboboyev (Qo‘shtepa)", "Rishton", "So‘x", "Toshloq", "Uchko‘prik", "O‘zbekiston", "Farg‘ona", "Yozyovon", "Quva"]
  },
  {
    name: "Jizzax viloyati",
    districts: ["Arnasoy", "Baxmal", "Do‘stlik", "Forish", "Gallaorol", "Jizzax (Sharof Rashidov)", "Mirzacho‘l", "Paxtakor", "Yangiobod", "Zafarobod", "Zamin", "Zarbdor"]
  },
  {
    name: "Namangan viloyati",
    districts: ["Chortoq", "Chust", "Kosonsoy", "Mingbuloq", "Namangan", "Norin", "Pop", "To‘raqo‘rg‘on", "Uchqo‘rg‘on", "Uychi", "Yangiqorg‘on", "Davlatobod"]
  },
  {
    name: "Navoiy viloyati",
    districts: ["Karmana", "Konimex", "Navbahor", "Nurota", "Tomdi", "Uchquduq", "Xatirchi", "Qiziltepa"]
  },
  {
    name: "Qashqadaryo viloyati",
    districts: ["Chiroqchi", "Dehqonobod", "Kasbi", "Kitob", "Koson", "Mirishkor", "Muborak", "Nishon", "Shahrisabz", "Qarshi", "Qamashi", "G‘uzor", "Yakkabog‘", "Ko‘kdala"]
  },
  {
    name: "Qoraqalpog‘iston Respublikasi",
    districts: ["Amudaryo", "Beruniy", "Chimboy", "Ellikqal’a", "Kegeyli", "Mo‘ynoq", "Nukus", "Qanliko‘l", "Qorao‘zak", "Qo‘ng‘irot", "Shumanay", "Taxtako‘pir", "To‘rtko‘l", "Xo‘jayli", "Bo‘zatov", "Taxiatosh"]
  },
  {
    name: "Samarqand viloyati",
    districts: ["Bulung‘ur", "Ishtixon", "Jomboy", "Kattaqo‘rg‘on", "Narpay", "Nurobod", "Oqdaryo", "Pastdarg‘om", "Paxtachi", "Poyariq", "Samarqand", "Toyloq", "Urgut", "Qo‘shrabot"]
  },
  {
    name: "Sirdaryo viloyati",
    districts: ["Boyovut", "Guliston", "Mirzaobod", "Oqoltin", "Sayxunobod", "Sardoba", "Sirdaryo", "Xovos", "Shirin", "Guliston shahar"]
  },
  {
    name: "Surxondaryo viloyati",
    districts: ["Angor", "Boysun", "Denov", "Jarqo‘rg‘on", "Muzrabot", "Oltinsoy", "Qiziriq", "Qumqo‘rg‘on", "Sariosiyo", "Sherobod", "Sho‘rchi", "Termiz", "Uzun", "Bandixon"]
  },
  {
    name: "Toshkent viloyati",
    districts: ["Bekobod", "Bo‘ka", "Bo‘stonliq", "Chinoz", "Oqqo‘rg‘on", "Ohangaron", "Parkent", "Piskent", "Quyichirchiq", "Toshkent", "O‘rtachirchiq", "Yangiyo‘l", "Yuqorichirchiq", "Zangiota", "Toshkent Shahar"]
  },
  {
    name: "Xorazm viloyati",
    districts: ["Bog‘ot", "Gurlan", "Hazorasp", "Shovot", "Urganch", "Xiva", "Xonqa", "Yangiariq", "Yangibozor", "Qo‘shko‘pir", "Tuproqqal’a"]
  }
];

export const SUBJECTS = [Subject.MATH, Subject.ENGLISH, Subject.COMBO];
export const GRADES = [1, 2, 3, 4, 5, 6];

export const PRICES = {
  SINGLE: 50000,
  COMBO: 80000
};