---
title: 'Laravel 中的文件下载：使用 Storage::download 方法'
description: 'Laravel 中的文件下载：使用 Storage::download 方法'
pubDate: 2024-12-22 11:12:32
tags: ["技术", "Laravel", "PHP"]
---
## Laravel 中的文件下载：使用 Storage::download
Laravel 的 Storage::download 方法简化了安全文件服务，提供了一个清晰的 API 来处理下载，同时管理文件存储抽象。

### 示例代码
以下是在控制器中使用 Storage::download() 的示例：
  
  ```php
<?php
namespace App\Http\Controllers;
use Illuminate\Support\Facades\Storage;
class FileController extends Controller {
    public function download($filename) {
        return Storage::download(
            "documents/{$filename}",
            "custom-{$filename}",
            ['Content-Type' => 'application/pdf']
        );
    }
}
  ```

### 使用 Storage::download() 的示例控制器
以下是 Storage::download() 在一个示例控制器中的使用：
  ```php
<?php
namespace App\Http\Controllers;
use App\Models\Document;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
class DocumentController extends Controller {
    public function download(Request $request, Document $document) {
        if (!$request->user()->canDownload($document)) {
            abort(403);
        }
        if (!Storage::exists($document->path)) {
            abort(404, 'File not found');
        }
        $document->increment('download_count');
        return Storage::download(
            $document->path,
            $document->original_name,
            [
                'Content-Type' => $document->mime_type,
                'Content-Disposition' => 'attachment',
                'Cache-Control' => 'no-cache, must-revalidate'
            ]
        );
    }
}
  ```
### 总结
总的来说，Storage::download 提供了一种安全、高效的方式来服务文件，同时抽象了存储提供者的细节。
