# Silo-Order-Management-System

## RUN 

با دستور زیر سرور ران میشه اما قبلش حتما به این موضوع توجه کنید نیاز هست که redis سرور اجرا شده باشه و بدون مشکل ران شده باشه . 

```
npm run start:dev 

```

از دیتابس های mongodb و redis و orm prisma استفاده شده . 

همینطور نیاز هست درون فایل .env متغییر های خودتون رو ست کنید که یکی ادرس دیتابیس mongodb هست 

یکی هم secret مربوط به jwt هستش . 


DATABASE_URL=""
JWT_SECRET = ""

## Folders 👇

درون فولدر schema.prisma مدل های مورد نیاز ایجاد شده و همینطور ارتباط با mongodb برقرار شده 

درون فولدر auth بخش های مربوط به login و register انجام شده و همینطور از JWT برای ایجاد توکن و احراز هویت استفاده شده . 

درون فولدر order کارهای مربوط به محصولات هندل شده 

درون فولدر inc که مخفف interceptor هست یک cache.interceptor.ts داریم 

درون فولدر guards اعتبار سنجی مربوط به role , jwt انجام شده 

درون فولدر @decorator دوتا decorator داریم یکی برای cache و یکی هم برای role

درون فولدر prisma ارتباط با prisma برقرار شده 

درون فولدر redis هم یک redis.module.ts داریم که ارتباط redis رو برقرار کرده . 

درون هر فولدر به عنوان مثال order یک فولدر به اسم dto تعریف شده که وظیفه ولیدیشن رو به عهده داره .


## API ✨

برای ثبت نام نیاز هست که فیلد های زیر رو داشته باشید 

**تکته : اگر که مقدار role رو تعریف نکنید به طور پیش فرض farmer در نظر گرفته میشه اما اگر می خواید admin ایجاد کنید role رو ADMIN بزارید دقت داشته باشید با حروف بزرگ بنویسید** 


```javascript
{
  "email":"farmer-1@gmail.com",
    "username":"user-farmer1",
    "password":"AwZ1@255678"
 "role":"FARMER" 

}
```
```

http://localhost:2024/auth/register 

```

وردی های register رو نیاز داره به غیر از role
```
http://localhost:2024/auth/login
```

نیاز به توکن برای ایجاد محصول هست که توکن رو موقع لاگین کشاورز  توکن رو در اختیار شما قرار خواهد داد

```
http://localhost:2024/order/create
```

فقط کسی که ادمین هست می تونه تمامی محصولات رو مشاهده کنه که نیاز به توکن هست که باز زمان لاگین شدن این توکن رو به شما خواهد داد
```
http://localhost:2024/order/admin
```

فقط ادمین می تونه وضیعت محصول رو تغییر بده که نیاز به ست کردن توکن هست که توکن رو موثع لاگین دریافت می کنید و نیاز هست که به عنوان param بیایم id محصول رو بهش پاس بدیم 

```
http://localhost:2024/order/admin/67489435b59b9585e3eab1be
```

کشاورز می تونه تمامی محصولات که صرفا خودش ایجاد کرده رو ببینه و نیاز به ست کردن توکن هست که توکن رو موقع لاگین شما خواهید داشت 

```
http://localhost:2024/order/farmer/orders
```


##  API Cache 🚀

این Api ها به وسیله redis کش شدن که کد مربوط رو می تونید درون order.controller.ts مشاهده کنید 


```
http://localhost:2024/order/farmer/orders
```

```
http://localhost:2024/order/admin
```
