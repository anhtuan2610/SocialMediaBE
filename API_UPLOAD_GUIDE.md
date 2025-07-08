# Upload API Guide

## Tổng quan
Hệ thống có 5 endpoint cho việc upload ảnh:
- **Avatar upload**: Upload avatar cho user đang đăng nhập
- **Create post with image**: Tạo post mới với ảnh (không cần postId)
- **Create message with image**: Tạo message mới với ảnh (không cần messageId)
- **Upload post image**: Upload ảnh cho post đã tồn tại (cần postId)
- **Upload message image**: Upload ảnh cho message đã tồn tại (cần messageId)

## Các Endpoint

### 1. Upload Avatar
**Endpoint:** `POST /upload/avatar`
**Authentication:** Required (Bearer Token)
**Content-Type:** `multipart/form-data`

**Request Body:**
- `image`: File ảnh (required) - **KHÔNG cần userId vì lấy từ token**

**Response:**
```json
{
  "message": "Avatar uploaded successfully",
  "imageUrl": "https://res.cloudinary.com/...",
  "user": {
    "id": "user_id",
    "avatar": "https://res.cloudinary.com/..."
  }
}
```

### 2. Create Post with Image (MỚI)
**Endpoint:** `POST /upload/create-post-with-image`
**Authentication:** Required (Bearer Token)
**Content-Type:** `multipart/form-data`

**Request Body:**
- `image`: File ảnh (required)
- `content`: Nội dung post (required)
- `title`: Tiêu đề post (optional)
- `location`: Vị trí (optional)

**Response:**
```json
{
  "message": "Post created successfully",
  "post": {
    "id": "post_id",
    "content": "Nội dung post",
    "title": "Tiêu đề post",
    "mediaUrl": "https://res.cloudinary.com/...",
    "location": "Hà Nội",
    "author": "user_id",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### 3. Create Message with Image (MỚI)
**Endpoint:** `POST /upload/create-message-with-image`
**Authentication:** Required (Bearer Token)
**Content-Type:** `multipart/form-data`

**Request Body:**
- `image`: File ảnh (required)
- `content`: Nội dung message (required)
- `chatRoomId`: ID của chat room (required)

**Response:**
```json
{
  "message": "Message created successfully",
  "messageData": {
    "id": "message_id",
    "content": "Nội dung message",
    "mediaUrl": "https://res.cloudinary.com/...",
    "messageType": "image",
    "sender": "user_id",
    "chatRoom": "chatroom_id",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### 4. Upload Post Image (Cách cũ)
**Endpoint:** `POST /upload/post-image`
**Authentication:** Required (Bearer Token)
**Content-Type:** `multipart/form-data`

**Request Body:**
- `image`: File ảnh (required)
- `postId`: ID của post (required)

**Response:**
```json
{
  "message": "Post image uploaded successfully",
  "imageUrl": "https://res.cloudinary.com/...",
  "post": {
    "id": "post_id",
    "mediaUrl": "https://res.cloudinary.com/..."
  }
}
```

### 5. Upload Message Image (Cách cũ)
**Endpoint:** `POST /upload/message-image`
**Authentication:** Required (Bearer Token)
**Content-Type:** `multipart/form-data`

**Request Body:**
- `image`: File ảnh (required)
- `messageId`: ID của message (required)

**Response:**
```json
{
  "message": "Message image uploaded successfully",
  "imageUrl": "https://res.cloudinary.com/...",
  "messageData": {
    "id": "message_id",
    "mediaUrl": "https://res.cloudinary.com/..."
  }
}
```

## Cách sử dụng

### Frontend Example (JavaScript)
```javascript
// Upload Avatar - KHÔNG cần userId
const uploadAvatar = async (file) => {
  const formData = new FormData();
  formData.append('image', file);

  const response = await fetch('/upload/avatar', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: formData
  });

  return response.json();
};

// Tạo post với ảnh (MỚI) - KHÔNG cần postId
const createPostWithImage = async (file, content, title, location) => {
  const formData = new FormData();
  formData.append('image', file);
  formData.append('content', content);
  if (title) formData.append('title', title);
  if (location) formData.append('location', location);

  const response = await fetch('/upload/create-post-with-image', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: formData
  });

  return response.json();
};

// Tạo message với ảnh (MỚI) - KHÔNG cần messageId
const createMessageWithImage = async (file, content, chatRoomId) => {
  const formData = new FormData();
  formData.append('image', file);
  formData.append('content', content);
  formData.append('chatRoomId', chatRoomId);

  const response = await fetch('/upload/create-message-with-image', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: formData
  });

  return response.json();
};

// Upload ảnh cho post (cách cũ) - CẦN postId
const uploadPostImage = async (file, postId) => {
  const formData = new FormData();
  formData.append('image', file);
  formData.append('postId', postId);

  const response = await fetch('/upload/post-image', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: formData
  });

  return response.json();
};

// Upload ảnh cho message (cách cũ) - CẦN messageId
const uploadMessageImage = async (file, messageId) => {
  const formData = new FormData();
  formData.append('image', file);
  formData.append('messageId', messageId);

  const response = await fetch('/upload/message-image', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: formData
  });

  return response.json();
};
```

### Frontend Example (React)
```jsx
import { useState } from 'react';

const ImageUpload = () => {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const uploadAvatar = async () => {
    if (!file) return;
    
    const formData = new FormData();
    formData.append('image', file);
    // KHÔNG cần formData.append('userId', userId);

    try {
      const response = await fetch('/upload/avatar', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      });
      
      const result = await response.json();
      console.log('Upload result:', result);
    } catch (error) {
      console.error('Upload error:', error);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} accept="image/*" />
      <button onClick={uploadAvatar}>Upload Avatar</button>
    </div>
  );
};
```

## Lưu ý quan trọng

### 1. Avatar Upload
- **KHÔNG cần gửi `userId`** trong request body
- User ID được lấy tự động từ JWT token
- Chỉ user đang đăng nhập mới có thể upload avatar cho chính mình

### 2. Create Post/Message with Image (MỚI - KHUYẾN NGHỊ)
- **KHÔNG cần `postId` hoặc `messageId`**
- Tạo post/message mới với ảnh cùng lúc
- Tiện lợi hơn, ít request hơn

### 3. Upload Post/Message Image (Cách cũ)
- **Cần gửi `postId` hoặc `messageId`** trong request body
- Đảm bảo post/message đã tồn tại trước khi upload
- Dùng khi muốn upload ảnh cho post/message đã có sẵn

### 4. Authentication
- Tất cả endpoint đều yêu cầu Bearer token
- Token phải hợp lệ và chưa hết hạn

### 5. File Format
- Chỉ hỗ trợ file ảnh
- Nên giới hạn kích thước file (có thể cấu hình trong multer)

## Error Codes

- `400`: 
  - Avatar: "User ID not found in token" hoặc "No image uploaded"
  - Post/Message: "Missing postId/messageId" hoặc "No image uploaded"
- `401`: Unauthorized (thiếu hoặc sai token)
- `404`: Post/Message not found
- `500`: Internal server error hoặc Cloudinary upload error

## Swagger Documentation

File `swagger.yaml` đã được tạo với đầy đủ documentation cho tất cả endpoint. Bạn có thể:
1. Mở file trong Swagger Editor
2. Import vào Swagger UI
3. Sử dụng để test API trực tiếp 