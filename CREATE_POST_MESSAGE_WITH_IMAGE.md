# Hướng dẫn tạo Post/Message với ảnh cùng lúc

## Tổng quan
Thay vì phải tạo post/message trước rồi mới upload ảnh, giờ bạn có thể tạo post/message với ảnh trong cùng 1 request!

## Các Endpoint mới

### 1. Tạo Post với ảnh
**Endpoint:** `POST /upload/create-post-with-image`

**Request Body (multipart/form-data):**
- `image`: File ảnh (required)
- `content`: Nội dung post (required)
- `title`: Tiêu đề post (optional)
- `location`: Vị trí (optional)

**Response:**
```json
{
  "message": "Post created successfully",
  "post": {
    "id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "content": "Đây là nội dung post với ảnh",
    "title": "Tiêu đề post",
    "mediaUrl": "https://res.cloudinary.com/your-cloud/image/upload/v1234567890/abc123.jpg",
    "location": "Hà Nội",
    "author": "64f8a1b2c3d4e5f6a7b8c9d1",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

### 2. Tạo Message với ảnh
**Endpoint:** `POST /upload/create-message-with-image`

**Request Body (multipart/form-data):**
- `image`: File ảnh (required)
- `content`: Nội dung message (required)
- `chatRoomId`: ID của chat room (required)

**Response:**
```json
{
  "message": "Message created successfully",
  "messageData": {
    "id": "64f8a1b2c3d4e5f6a7b8c9d2",
    "content": "Đây là message với ảnh",
    "mediaUrl": "https://res.cloudinary.com/your-cloud/image/upload/v1234567890/def456.jpg",
    "messageType": "image",
    "sender": "64f8a1b2c3d4e5f6a7b8c9d1",
    "chatRoom": "64f8a1b2c3d4e5f6a7b8c9d3",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

## Cách sử dụng

### Frontend (JavaScript)

#### Tạo Post với ảnh:
```javascript
const createPostWithImage = async (file, content, title = null, location = null) => {
  try {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('content', content);
    
    if (title) formData.append('title', title);
    if (location) formData.append('location', location);

    const response = await fetch('/upload/create-post-with-image', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: formData
    });

    if (!response.ok) {
      throw new Error('Failed to create post');
    }

    const result = await response.json();
    console.log('Post created:', result);
    return result;
  } catch (error) {
    console.error('Error creating post:', error);
    throw error;
  }
};

// Sử dụng
const handleCreatePost = async () => {
  const fileInput = document.getElementById('imageInput');
  const contentInput = document.getElementById('contentInput');
  const titleInput = document.getElementById('titleInput');
  const locationInput = document.getElementById('locationInput');

  const file = fileInput.files[0];
  const content = contentInput.value;
  const title = titleInput.value;
  const location = locationInput.value;

  if (!file || !content) {
    alert('Vui lòng chọn ảnh và nhập nội dung!');
    return;
  }

  try {
    const result = await createPostWithImage(file, content, title, location);
    alert('Tạo post thành công!');
    // Reset form hoặc redirect
  } catch (error) {
    alert('Có lỗi xảy ra: ' + error.message);
  }
};
```

#### Tạo Message với ảnh:
```javascript
const createMessageWithImage = async (file, content, chatRoomId) => {
  try {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('content', content);
    formData.append('chatRoomId', chatRoomId);

    const response = await fetch('/upload/create-message-with-image', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: formData
    });

    if (!response.ok) {
      throw new Error('Failed to create message');
    }

    const result = await response.json();
    console.log('Message created:', result);
    return result;
  } catch (error) {
    console.error('Error creating message:', error);
    throw error;
  }
};

// Sử dụng
const handleSendImageMessage = async () => {
  const fileInput = document.getElementById('imageInput');
  const contentInput = document.getElementById('messageInput');
  const chatRoomId = '64f8a1b2c3d4e5f6a7b8c9d3'; // Lấy từ context

  const file = fileInput.files[0];
  const content = contentInput.value;

  if (!file || !content) {
    alert('Vui lòng chọn ảnh và nhập nội dung!');
    return;
  }

  try {
    const result = await createMessageWithImage(file, content, chatRoomId);
    alert('Gửi message thành công!');
    // Reset form hoặc update UI
  } catch (error) {
    alert('Có lỗi xảy ra: ' + error.message);
  }
};
```

### Frontend (React)

#### Component tạo Post:
```jsx
import React, { useState } from 'react';

const CreatePostWithImage = () => {
  const [file, setFile] = useState(null);
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!file || !content) {
      alert('Vui lòng chọn ảnh và nhập nội dung!');
      return;
    }

    setLoading(true);
    
    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('content', content);
      if (title) formData.append('title', title);
      if (location) formData.append('location', location);

      const response = await fetch('/upload/create-post-with-image', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error('Failed to create post');
      }

      const result = await response.json();
      alert('Tạo post thành công!');
      
      // Reset form
      setFile(null);
      setContent('');
      setTitle('');
      setLocation('');
      
    } catch (error) {
      alert('Có lỗi xảy ra: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-post">
      <h2>Tạo Post với ảnh</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Chọn ảnh:</label>
          <input 
            type="file" 
            accept="image/*" 
            onChange={handleFileChange}
            required
          />
        </div>
        
        <div>
          <label>Nội dung:</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Nhập nội dung post..."
            required
          />
        </div>
        
        <div>
          <label>Tiêu đề (tùy chọn):</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Nhập tiêu đề..."
          />
        </div>
        
        <div>
          <label>Vị trí (tùy chọn):</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Nhập vị trí..."
          />
        </div>
        
        <button type="submit" disabled={loading}>
          {loading ? 'Đang tạo...' : 'Tạo Post'}
        </button>
      </form>
    </div>
  );
};

export default CreatePostWithImage;
```

#### Component tạo Message:
```jsx
import React, { useState } from 'react';

const SendImageMessage = ({ chatRoomId }) => {
  const [file, setFile] = useState(null);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!file || !content) {
      alert('Vui lòng chọn ảnh và nhập nội dung!');
      return;
    }

    setLoading(true);
    
    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('content', content);
      formData.append('chatRoomId', chatRoomId);

      const response = await fetch('/upload/create-message-with-image', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const result = await response.json();
      alert('Gửi message thành công!');
      
      // Reset form
      setFile(null);
      setContent('');
      
    } catch (error) {
      alert('Có lỗi xảy ra: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="send-image-message">
      <h3>Gửi ảnh với tin nhắn</h3>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Chọn ảnh:</label>
          <input 
            type="file" 
            accept="image/*" 
            onChange={handleFileChange}
            required
          />
        </div>
        
        <div>
          <label>Nội dung:</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Nhập nội dung tin nhắn..."
            required
          />
        </div>
        
        <button type="submit" disabled={loading}>
          {loading ? 'Đang gửi...' : 'Gửi ảnh'}
        </button>
      </form>
    </div>
  );
};

export default SendImageMessage;
```

## Lợi ích của cách mới

### 1. **Hiệu quả hơn:**
- Chỉ cần 1 request thay vì 2 (tạo post + upload ảnh)
- Giảm thời gian chờ và băng thông

### 2. **Đơn giản hơn:**
- Không cần lo về việc tạo post trước rồi update sau
- Không cần quản lý postId/messageId

### 3. **Ít lỗi hơn:**
- Tránh trường hợp tạo post thành công nhưng upload ảnh thất bại
- Đảm bảo tính nhất quán của dữ liệu

## Error Handling

### Các lỗi thường gặp:
- `400`: Thiếu file ảnh hoặc nội dung
- `401`: Token không hợp lệ
- `500`: Lỗi server hoặc Cloudinary

### Cách xử lý:
```javascript
try {
  const result = await createPostWithImage(file, content, title, location);
  // Xử lý thành công
} catch (error) {
  if (error.message.includes('400')) {
    alert('Vui lòng kiểm tra lại thông tin!');
  } else if (error.message.includes('401')) {
    alert('Phiên đăng nhập đã hết hạn!');
  } else {
    alert('Có lỗi xảy ra, vui lòng thử lại!');
  }
}
```

## Lưu ý quan trọng

1. **File size**: Nên giới hạn kích thước file (ví dụ: 5MB)
2. **File type**: Chỉ hỗ trợ file ảnh (jpg, png, gif, etc.)
3. **Authentication**: Luôn cần token hợp lệ
4. **Content**: Nội dung không được để trống
5. **ChatRoomId**: Với message, cần có chatRoomId hợp lệ 