---
title: 'Laravel 自定义转换（Casts）的数据定制化'
description: 'Laravel 自定义转换（Casts）的数据定制化'
pubDate: 2024-12-23 16:18:12
tags: ["技术", "Laravel", "PHP"]
---

## Laravel 自定义转换（Casts）的数据定制化
Laravel 的自定义转换（custom casts）功能允许我们进行定制化的数据转换，它超越了内置的转换能力，能够处理复杂的数据类型和业务逻辑。

### 电话号码格式化示例
以下是使用自定义转换进行电话号码格式化的示例代码：
```php
<?php
  namespace App\Casts;
  use Illuminate\Contracts\Database\Eloquent\CastsAttributes;
  use Illuminate\Database\Eloquent\Model;
  
  class PhoneNumber implements CastsAttributes {
      public function get(Model $model, string $key, mixed $value, array $attributes): string {
          return sprintf(
              "+%d (%d) %d-%d",
              ...explode('|', $value)
          );
      }
      public function set(Model $model, string $key, mixed $value, array $attributes): string {
          $value = preg_replace('/[^0-9]/', '', $value);
          return implode('|', [
              substr($value, 0, 1),
              substr($value, 1, 3),
              substr($value, 4, 3),
              substr($value, 7)
          ]);
      }
}
```

### 地址格式化示例
以下是使用自定义转换进行地址格式化的示例代码：
```php
<?php
namespace App\Casts;
use Illuminate\Contracts\Database\Eloquent\CastsAttributes;
use Illuminate\Database\Eloquent\Model;

class Address implements CastsAttributes {
    public function get(Model $model, string $key, mixed $value, array $attributes): array {
        $data = json_decode($value, true);
        return [
            'street' => $data['street'],
            'city' => $data['city'],
            'state' => $data['state'],
            'postal_code' => $data['postal_code'],
            'formatted' => sprintf(
                '%s, %s, %s %s',
                $data['street'],
                $data['city'],
                $data['state'],
                $data['postal_code']
            )
        ];
    }
    public function set(Model $model, string $key, mixed $value, array $attributes): string {
        return json_encode([
            'street' => $value['street'],
            'city' => $value['city'],
            'state' => $value['state'],
            'postal_code' => $value['postal_code']
        ]);
    }
}
```

### 在模型中使用自定义转换
在模型中，你可以像这样使用自定义转换：
```php
class User extends Model {
    protected $casts = [
        'address' => Address::class,
        'phone' => PhoneNumber::class
    ];
}
```


