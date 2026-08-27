import { Product, GroupPool } from '../types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-chatgpt-plus',
    title: 'ChatGPT Plus & Codex Team Seat (30 Ngày)',
    subtitle: 'Slot riêng tư trong OpenAI Team Workspace, GPT-4o, Canvas & DALL·E 3 không giới hạn tốc độ',
    category: 'ai_tools',
    platform: 'OpenAI',
    bannerImg: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=800&q=80',
    retailPrice: 520000,
    groupPrice: 105000,
    minSlots: 5,
    deliveryType: 'account_invite',
    deliveryEstimate: 'Tự động duyệt ngay khi đủ 5 slot',
    description: 'Mua chung gói OpenAI Business/Team Workspace bản quyền chính hãng. Mỗi người nhận một invite slot riêng biệt vào email cá nhân, bảo mật lịch sử chat 100%, không bị out tài khoản.',
    features: [
      'Truy cập GPT-4o, GPT-4.5 Preview & o3-mini',
      'Code Interpreter, Advanced Voice Mode & Canvas',
      'Slot riêng tư (Private Workspace Member)',
      'Bảo hành trọn vẹn 30 ngày qua ví Escrow'
    ],
    instructions: [
      '1. Tham gia slot trong pool đang mở hoặc tạo pool mới',
      '2. Khi đủ 5/5 người, hệ thống tự động gửi link mời Workspace vào email của bạn',
      '3. Chấp nhận lời mời để kích hoạt ChatGPT Plus ngay lập tức'
    ],
    seller: {
      id: 'seller-neural-01',
      name: 'CyberNeural Lab',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      badge: 'Tesla Verified',
      rating: 4.98,
      totalDeals: 1420,
      completedPools: 890,
      responseTime: '< 2 phút'
    },
    activePools: [
      {
        id: 'pool-gpt-881',
        productId: 'prod-chatgpt-plus',
        title: 'Nhóm OpenAI Team Pro Batch #881',
        targetSlots: 5,
        filledSlots: 4,
        pricePerSlot: 105000,
        retailPrice: 520000,
        savingsPercent: 80,
        expiresAt: '2h 15m',
        status: 'filling',
        hostName: 'Elon_X_Admin',
        isHot: true,
        participants: [
          { id: 'p1', name: 'Trọng_Dev.ts', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80', joinedAt: '12 phút trước', txHash: '0x9a8f...4e1', slotNumber: 1 },
          { id: 'p2', name: 'CyberKiet_99', avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=100&q=80', joinedAt: '9 phút trước', txHash: '0x3c21...8b4', slotNumber: 2 },
          { id: 'p3', name: 'NguyenAn_AI', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=100&q=80', joinedAt: '5 phút trước', txHash: '0x17d2...f09', slotNumber: 3 },
          { id: 'p4', name: 'Vortex_Gamer', avatar: 'https://images.unsplash.com/photo-1628157582853-a796fa650a6a?auto=format&fit=crop&w=100&q=80', joinedAt: '1 phút trước', txHash: '0x55aa...331', slotNumber: 4 }
        ],
        keysVault: [
          { id: 'k1', code: 'https://chatgpt.com/invite/team/cp-881-slot-01', status: 'reserved' },
          { id: 'k2', code: 'https://chatgpt.com/invite/team/cp-881-slot-02', status: 'reserved' },
          { id: 'k3', code: 'https://chatgpt.com/invite/team/cp-881-slot-03', status: 'reserved' },
          { id: 'k4', code: 'https://chatgpt.com/invite/team/cp-881-slot-04', status: 'reserved' },
          { id: 'k5', code: 'https://chatgpt.com/invite/team/cp-881-slot-05', status: 'available' }
        ]
      }
    ],
    rating: 4.96,
    reviewCount: 312,
    userReviews: [
      {
        id: 'rev-gpt-01',
        userId: 'user-vip-99',
        userName: 'Trọng_Dev.ts',
        userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80',
        rating: 5,
        comment: 'Gom đơn đủ 5 người trong 15 phút, link invite vào email nhận ngay lập tức. Dùng GPT-4o và Canvas mượt mà, không bị dis profile!',
        createdAt: '15 phút trước',
        verifiedPurchase: true,
        likes: 12
      },
      {
        id: 'rev-gpt-02',
        userId: 'user-02',
        userName: 'CyberKiet_99',
        userAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=100&q=80',
        rating: 5,
        comment: 'Giá quá rẻ chỉ 105k so với 520k giá lẻ. Có bảo lãnh ví Escrow nên cực kỳ yên tâm, 5 sao chất lượng!',
        createdAt: '2 giờ trước',
        verifiedPurchase: true,
        likes: 8
      },
      {
        id: 'rev-gpt-03',
        userId: 'user-03',
        userName: 'NguyenAn_AI',
        userAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=100&q=80',
        rating: 5,
        comment: 'Đã gia hạn tháng thứ 3 ở shop, hỗ trợ đổi invite rất nhanh khi có trục trặc nhỏ.',
        createdAt: '1 ngày trước',
        verifiedPurchase: true,
        likes: 5
      }
    ],
    stockAvailable: 25,
    isFlashSale: true,
    flashSaleEnds: '04:22:19',
    flashSaleStockClaimed: 84,
    flashSaleTotalStock: 100,
    tags: ['FLASH SALE -80%', 'HOT DEAL', 'AI CODE', 'INSTANT']
  },
  {
    id: 'prod-black-myth-wukong',
    title: 'Steam Key: Black Myth Wukong (Global Key)',
    subtitle: 'Bản quyền Steam Global vĩnh viễn, nhận CD-Key kích hoạt trực tiếp vào thư viện tài khoản cá nhân',
    category: 'gaming',
    platform: 'Steam',
    bannerImg: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80',
    retailPrice: 1299000,
    groupPrice: 640000,
    minSlots: 4,
    deliveryType: 'instant_key',
    deliveryEstimate: 'Mã CD-Key bung ngay khi đủ nhóm 4 key sỉ',
    description: 'Chương trình gom sỉ Steam Key từ nhà phân phối uỷ quyền khu vực SEA. Khi gom đủ lốc 4 keys, giá chỉ còn một nửa so với giá niêm yết trên Steam Store.',
    features: [
      'CD-Key Steam Global 100% bản quyền chính hãng',
      'Kích hoạt trực tiếp vào account cá nhân của bạn',
      'Đầy đủ Achievements & Steam Cloud Sync',
      'Hỗ trợ đổi key mới ngay nếu có lỗi kích hoạt'
    ],
    instructions: [
      '1. Mở ứng dụng Steam trên PC',
      '2. Chọn Games -> Activate a Product on Steam',
      '3. Nhập CD-Key nhận được từ CyberPool Vault để tải game'
    ],
    seller: {
      id: 'seller-steam-sea',
      name: 'Valkyrie Global Keys',
      avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&w=150&q=80',
      badge: 'SpaceX Master',
      rating: 4.99,
      totalDeals: 3890,
      completedPools: 1204,
      responseTime: '< 1 phút'
    },
    activePools: [
      {
        id: 'pool-wukong-402',
        productId: 'prod-black-myth-wukong',
        title: 'Gom sỉ CD-Key Wukong SEA #402',
        targetSlots: 4,
        filledSlots: 3,
        pricePerSlot: 640000,
        retailPrice: 1299000,
        savingsPercent: 51,
        expiresAt: '45m 10s',
        status: 'filling',
        hostName: 'SpaceX_Captain',
        isHot: true,
        participants: [
          { id: 'p1', name: 'HoangLong_PC', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80', joinedAt: '18 phút trước', txHash: '0x99e8...11a', slotNumber: 1 },
          { id: 'p2', name: 'MinhQuan_Steam', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80', joinedAt: '10 phút trước', txHash: '0x77b3...cca', slotNumber: 2 },
          { id: 'p3', name: 'DuyTan_Cyber', avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=100&q=80', joinedAt: '3 phút trước', txHash: '0x22f1...890', slotNumber: 3 }
        ],
        keysVault: [
          { id: 'k1', code: 'ST-WUK-9812-441A-QXP9', status: 'reserved' },
          { id: 'k2', code: 'ST-WUK-3120-994F-ZLM2', status: 'reserved' },
          { id: 'k3', code: 'ST-WUK-7718-201K-BVT6', status: 'reserved' },
          { id: 'k4', code: 'ST-WUK-8841-610P-NXY4', status: 'available' }
        ]
      }
    ],
    rating: 4.97,
    reviewCount: 540,
    userReviews: [
      {
        id: 'rev-wuk-01',
        userId: 'user-04',
        userName: 'HoangLong_PC',
        userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80',
        rating: 5,
        comment: 'Key Steam Global kích hoạt mượt mà vào thư viện ngay! Giá sỉ 640k quá hời so với 1tr3 trên Steam Store.',
        createdAt: '30 phút trước',
        verifiedPurchase: true,
        likes: 19
      },
      {
        id: 'rev-wuk-02',
        userId: 'user-05',
        userName: 'MinhQuan_Steam',
        userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80',
        rating: 5,
        comment: 'Game siêu phẩm đồ họa đỉnh chóp, tải về chiến ngay không gặp bất kỳ lỗi kích hoạt nào.',
        createdAt: '4 giờ trước',
        verifiedPurchase: true,
        likes: 14
      }
    ],
    stockAvailable: 18,
    isFlashSale: true,
    flashSaleEnds: '01:14:48',
    flashSaleStockClaimed: 92,
    flashSaleTotalStock: 100,
    tags: ['FLASH SALE', 'STEAM GLOBAL', 'SAVE 51%', 'TRIPLE-A GAME']

  },
  {
    id: 'prod-giftup-card-50',
    title: 'Thẻ Quà Tặng Số GiftUp Card $50 USD (Digital Voucher)',
    subtitle: 'Voucher kỹ thuật số nạp game, thanh toán app & mua sắm toàn cầu với mã PIN cào bảo mật',
    category: 'giftup_cards',
    platform: 'GiftUp',
    bannerImg: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=800&q=80',
    retailPrice: 1250000,
    groupPrice: 720000,
    minSlots: 5,
    deliveryType: 'giftup_card',
    deliveryEstimate: 'Mã GiftUp & Barcode sinh tự động tức thì',
    description: 'Thẻ quà tặng điện tử GiftUp chính hãng mệnh giá $50 USD. Cho phép sử dụng tại hàng nghìn merchant số và đối tác quốc tế. Tích hợp trực tiếp với máy quét Barcode và chuẩn GiftUp API.',
    features: [
      'Mã thẻ 16 số chuẩn GiftUp với PIN bảo mật 4 chữ số',
      'Tra cứu số dư trực tiếp qua cổng xác thực GiftUp Network',
      'Định dạng E-Gift Card đồ hoạ Cyber sang trọng, có thể in hoặc chia sẻ',
      'Bảo lưu số dư vĩnh viễn, không tính phí duy trì'
    ],
    instructions: [
      '1. Mở màn hình Thẻ GiftUp trong CyberPool Vault',
      '2. Cào lớp mã bảo mật để lấy 16 số Card Number và PIN',
      '3. Quét Barcode hoặc nhập trực tiếp tại trang thanh toán của đối tác GiftUp'
    ],
    seller: {
      id: 'seller-giftup-corp',
      name: 'GiftUp Direct Global',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80',
      badge: 'Cyber Escrow',
      rating: 4.99,
      totalDeals: 5200,
      completedPools: 1890,
      responseTime: 'Tức thì (<30s)'
    },
    activePools: [
      {
        id: 'pool-giftup-109',
        productId: 'prod-giftup-card-50',
        title: 'Gom lốc GiftUp $50 Card Deal #109',
        targetSlots: 5,
        filledSlots: 3,
        pricePerSlot: 720000,
        retailPrice: 1250000,
        savingsPercent: 42,
        expiresAt: '1h 30m',
        status: 'filling',
        hostName: 'GiftUp_Official',
        isHot: true,
        participants: [
          { id: 'p1', name: 'CyberKnight', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=100&q=80', joinedAt: '30 phút trước', txHash: '0x18a1...101', slotNumber: 1 },
          { id: 'p2', name: 'PhuongThao_HN', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&q=80', joinedAt: '15 phút trước', txHash: '0x889a...202', slotNumber: 2 },
          { id: 'p3', name: 'Alex_Vn', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=100&q=80', joinedAt: '4 phút trước', txHash: '0x66c1...303', slotNumber: 3 }
        ],
        keysVault: [
          { id: 'k1', code: 'GU-50USD-8891-3320-1091', pin: '4821', status: 'reserved' },
          { id: 'k2', code: 'GU-50USD-4412-9901-1092', pin: '7712', status: 'reserved' },
          { id: 'k3', code: 'GU-50USD-2219-5510-1093', pin: '9034', status: 'reserved' },
          { id: 'k4', code: 'GU-50USD-1108-7744-1094', pin: '3156', status: 'available' },
          { id: 'k5', code: 'GU-50USD-6673-8822-1095', pin: '5529', status: 'available' }
        ]
      }
    ],
    rating: 4.98,
    reviewCount: 420,
    stockAvailable: 35,
    tags: ['GIFTUP API', 'TIẾT KIỆM 42%', 'BARCODE SCAN', 'AUTO DISPATCH']
  },
  {
    id: 'prod-midjourney-pro',
    title: 'Midjourney Pro Plan (Slot Riêng / Shared Fast Hours)',
    subtitle: '30h Fast Generation, Relax Mode không giới hạn, Stealth Mode bảo mật prompt',
    category: 'ai_tools',
    platform: 'Midjourney',
    bannerImg: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
    retailPrice: 780000,
    groupPrice: 155000,
    minSlots: 5,
    deliveryType: 'account_invite',
    deliveryEstimate: 'Cấp token & bot invite ngay khi pool chốt',
    description: 'Chia sẻ gói Midjourney Pro $60/tháng tối đa 5 người dùng qua kênh Discord Dedicated Bot riêng biệt, không giẫm chân lên nhau, render tốc độ ánh sáng.',
    features: [
      '30 Giờ GPU Fast Hours siêu tốc',
      'Chế độ Stealth Mode ẩn ảnh khỏi thư viện công cộng',
      'Hỗ trợ upscale 4K, pan, zoom, inpainting V6.1',
      'Bảo hành đổi phiên nếu lỗi bot Discord'
    ],
    instructions: [
      '1. Tham gia nhóm gom đơn Midjourney',
      '2. Khi đủ 5 người, nhận link Discord Server phân bổ bot riêng',
      '3. Dùng lệnh /imagine trực tiếp trong phòng riêng tư của bạn'
    ],
    seller: {
      id: 'seller-neural-01',
      name: 'CyberNeural Lab',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      badge: 'Tesla Verified',
      rating: 4.98,
      totalDeals: 1420,
      completedPools: 890,
      responseTime: '< 2 phút'
    },
    activePools: [
      {
        id: 'pool-mj-332',
        productId: 'prod-midjourney-pro',
        title: 'Nhóm Midjourney V6.1 Fast #332',
        targetSlots: 5,
        filledSlots: 4,
        pricePerSlot: 155000,
        retailPrice: 780000,
        savingsPercent: 80,
        expiresAt: '58m 20s',
        status: 'filling',
        hostName: 'Midjourney_Vip',
        isHot: true,
        participants: [
          { id: 'p1', name: 'DesignPro_Hcm', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80', joinedAt: '40 phút trước', txHash: '0x123...456', slotNumber: 1 },
          { id: 'p2', name: 'Creative_X', avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=100&q=80', joinedAt: '25 phút trước', txHash: '0x789...abc', slotNumber: 2 },
          { id: 'p3', name: 'Studio_99', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=100&q=80', joinedAt: '12 phút trước', txHash: '0xdef...123', slotNumber: 3 },
          { id: 'p4', name: 'ArtDirector_Vn', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80', joinedAt: '2 phút trước', txHash: '0x456...789', slotNumber: 4 }
        ],
        keysVault: [
          { id: 'k1', code: 'https://discord.gg/cyberpool-mj-slot-1', status: 'reserved' },
          { id: 'k2', code: 'https://discord.gg/cyberpool-mj-slot-2', status: 'reserved' },
          { id: 'k3', code: 'https://discord.gg/cyberpool-mj-slot-3', status: 'reserved' },
          { id: 'k4', code: 'https://discord.gg/cyberpool-mj-slot-4', status: 'reserved' },
          { id: 'k5', code: 'https://discord.gg/cyberpool-mj-slot-5', status: 'available' }
        ]
      }
    ],
    rating: 4.95,
    reviewCount: 188,
    stockAvailable: 12,
    tags: ['AI GENERATION', 'TIẾT KIỆM 80%', 'DISCORD BOT']
  },
  {
    id: 'prod-netflix-4k',
    title: 'Netflix Premium 4K UHD (Profile Riêng + Mã PIN 30 Ngày)',
    subtitle: 'Xem cùng lúc 4K HDR, Dolby Atmos, có mã PIN khóa profile cá nhân không ai can thiệp',
    category: 'streaming',
    platform: 'Netflix',
    bannerImg: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?auto=format&fit=crop&w=800&q=80',
    retailPrice: 260000,
    groupPrice: 55000,
    minSlots: 5,
    deliveryType: 'account_invite',
    deliveryEstimate: 'Nhận tài khoản & Slot PIN ngay khi đầy pool',
    description: 'Gom đơn chia sẻ gói Netflix Family cao cấp nhất 4K Ultra HD. Mỗi thành viên được gán 1 Profile riêng biệt kèm mã PIN 4 số cá nhân, bảo đảm không bị trùng thiết bị.',
    features: [
      'Chất lượng hình ảnh 4K HDR + Âm thanh vòm Dolby Atmos',
      'Profile riêng biệt được đặt tên & gán mã PIN cá nhân',
      'Đăng nhập được trên Smart TV, PC, iPad & Điện thoại',
      'Hỗ trợ gia hạn giữ nguyên profile và lịch sử xem'
    ],
    instructions: [
      '1. Đăng nhập tài khoản Netflix cấp trong CyberPool Vault',
      '2. Chọn đúng Profile số được gán và nhập mã PIN',
      '3. Thưởng thức trọn vẹn kho phim bom tấn'
    ],
    seller: {
      id: 'seller-stream-hub',
      name: 'CyberStream Prime',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      badge: 'Tesla Verified',
      rating: 4.97,
      totalDeals: 4100,
      completedPools: 2980,
      responseTime: '< 1 phút'
    },
    activePools: [
      {
        id: 'pool-nfx-901',
        productId: 'prod-netflix-4k',
        title: 'Gom Netflix Premium 4K Pool #901',
        targetSlots: 5,
        filledSlots: 3,
        pricePerSlot: 55000,
        retailPrice: 260000,
        savingsPercent: 79,
        expiresAt: '3h 10m',
        status: 'filling',
        hostName: 'StreamMaster',
        isHot: true,
        participants: [
          { id: 'p1', name: 'HaMy_Cinema', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&q=80', joinedAt: '1 giờ trước', txHash: '0xaa1...bb2', slotNumber: 1 },
          { id: 'p2', name: 'TuanAnh_Tv', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=100&q=80', joinedAt: '25 phút trước', txHash: '0xcc3...dd4', slotNumber: 2 },
          { id: 'p3', name: 'LanHuong_HN', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=100&q=80', joinedAt: '7 phút trước', txHash: '0xee5...ff6', slotNumber: 3 }
        ],
        keysVault: [
          { id: 'k1', code: 'netflx-p901-user@cyberpool.io:Cy#Ber9928 | Slot 1 PIN: 8192', status: 'reserved' },
          { id: 'k2', code: 'netflx-p901-user@cyberpool.io:Cy#Ber9928 | Slot 2 PIN: 1409', status: 'reserved' },
          { id: 'k3', code: 'netflx-p901-user@cyberpool.io:Cy#Ber9928 | Slot 3 PIN: 7721', status: 'reserved' },
          { id: 'k4', code: 'netflx-p901-user@cyberpool.io:Cy#Ber9928 | Slot 4 PIN: 3390', status: 'available' },
          { id: 'k5', code: 'netflx-p901-user@cyberpool.io:Cy#Ber9928 | Slot 5 PIN: 9012', status: 'available' }
        ]
      }
    ],
    rating: 4.93,
    reviewCount: 940,
    stockAvailable: 40,
    tags: ['4K ULTRA HD', 'GIÁ RẺ 55K', 'PRIVATE PIN']
  },
  {
    id: 'prod-adobe-all-apps',
    title: 'Adobe Creative Cloud All Apps (1 Năm License Enterprise)',
    subtitle: 'Photoshop, Illustrator, Premiere Pro, After Effects & 100GB Cloud lưu trữ',
    category: 'software',
    platform: 'Adobe',
    bannerImg: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80',
    retailPrice: 1800000,
    groupPrice: 390000,
    minSlots: 6,
    deliveryType: 'account_invite',
    deliveryEstimate: 'Mời email chính chủ kích hoạt Adobe ID',
    description: 'Gom đơn gói Adobe Team Enterprise được bảo trợ bản quyền. Bạn dùng chính email cá nhân đăng nhập Adobe Creative Cloud desktop app, cập nhật mọi phiên bản mới nhất cùng Adobe Firefly Generative Fill.',
    features: [
      '20+ ứng dụng Creative Cloud đầy đủ bản quyền',
      'Tích hợp Adobe Firefly AI Generative Fill & Generative Expand',
      '100GB Cloud Storage đồng bộ file đa thiết bị',
      'Kích hoạt trực tiếp vào tài khoản Adobe ID của bạn'
    ],
    instructions: [
      '1. Điền email Adobe ID của bạn khi tham gia slot',
      '2. Chấp nhận email mời từ Adobe Admin Console',
      '3. Tải Creative Cloud App và đăng nhập sử dụng'
    ],
    seller: {
      id: 'seller-license-hub',
      name: 'Apex Software Vault',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
      badge: 'Top Merchant',
      rating: 4.96,
      totalDeals: 2150,
      completedPools: 730,
      responseTime: '< 5 phút'
    },
    activePools: [
      {
        id: 'pool-adobe-610',
        productId: 'prod-adobe-all-apps',
        title: 'Adobe Enterprise License Cohort #610',
        targetSlots: 6,
        filledSlots: 5,
        pricePerSlot: 390000,
        retailPrice: 1800000,
        savingsPercent: 78,
        expiresAt: '15m 30s',
        status: 'filling',
        hostName: 'ApexAdmin',
        isHot: true,
        participants: [
          { id: 'p1', name: 'Nam_Graphic', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80', joinedAt: '1 giờ trước', txHash: '0x111...222', slotNumber: 1 },
          { id: 'p2', name: 'Linh_Designer', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&q=80', joinedAt: '45 phút trước', txHash: '0x333...444', slotNumber: 2 },
          { id: 'p3', name: 'Quang_Video', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80', joinedAt: '20 phút trước', txHash: '0x555...666', slotNumber: 3 },
          { id: 'p4', name: 'Thanh_Motion', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=100&q=80', joinedAt: '12 phút trước', txHash: '0x777...888', slotNumber: 4 },
          { id: 'p5', name: 'Minh_Architect', avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=100&q=80', joinedAt: '3 phút trước', txHash: '0x999...aaa', slotNumber: 5 }
        ],
        keysVault: [
          { id: 'k1', code: 'https://adminconsole.adobe.com/invite/ad-610-s1', status: 'reserved' },
          { id: 'k2', code: 'https://adminconsole.adobe.com/invite/ad-610-s2', status: 'reserved' },
          { id: 'k3', code: 'https://adminconsole.adobe.com/invite/ad-610-s3', status: 'reserved' },
          { id: 'k4', code: 'https://adminconsole.adobe.com/invite/ad-610-s4', status: 'reserved' },
          { id: 'k5', code: 'https://adminconsole.adobe.com/invite/ad-610-s5', status: 'reserved' },
          { id: 'k6', code: 'https://adminconsole.adobe.com/invite/ad-610-s6', status: 'available' }
        ]
      }
    ],
    rating: 4.97,
    reviewCount: 310,
    stockAvailable: 15,
    tags: ['FIREFLY AI', 'TIẾT KIỆM 78%', '1 NĂM LICENSE']
  },
  {
    id: 'prod-spotify-family',
    title: 'Spotify Premium Family (1 Năm Kích Hoạt Mail Chính Chủ)',
    subtitle: 'Nghe nhạc 320kbps không quảng cáo, tải offline, bảo hành trọn đời gói',
    category: 'streaming',
    platform: 'Spotify',
    bannerImg: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80',
    retailPrice: 350000,
    groupPrice: 95000,
    minSlots: 5,
    deliveryType: 'account_invite',
    deliveryEstimate: 'Nhận link invite gia đình sau 10 giây',
    description: 'Gói Spotify Family nâng cấp trực tiếp tài khoản hiện tại của bạn. Giữ nguyên toàn bộ bài hát yêu thích, playlist và podcast.',
    features: [
      'Chất lượng âm thanh Lossless/Extreme 320kbps',
      'Tải nhạc không giới hạn nghe offline trên máy bay',
      'Không bao giờ bị chèn quảng cáo làm phiền',
      'Kích hoạt trên chính email Spotify của bạn'
    ],
    instructions: [
      '1. Nhận link mời Spotify Family trong CyberPool Vault',
      '2. Nhập địa chỉ nhà gia đình được cung cấp trong hướng dẫn',
      '3. Hoàn tất kích hoạt Premium 12 tháng'
    ],
    seller: {
      id: 'seller-stream-hub',
      name: 'CyberStream Prime',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      badge: 'Tesla Verified',
      rating: 4.97,
      totalDeals: 4100,
      completedPools: 2980,
      responseTime: '< 1 phút'
    },
    activePools: [
      {
        id: 'pool-spot-771',
        productId: 'prod-spotify-family',
        title: 'Spotify Family 12T Kích Hoạt Chính Chủ #771',
        targetSlots: 5,
        filledSlots: 4,
        pricePerSlot: 95000,
        retailPrice: 350000,
        savingsPercent: 73,
        expiresAt: '1h 12m',
        status: 'filling',
        hostName: 'MusicLover_99',
        isHot: true,
        participants: [
          { id: 'p1', name: 'HaiDang_Vip', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80', joinedAt: '35 phút trước', txHash: '0xabc...111', slotNumber: 1 },
          { id: 'p2', name: 'ThuTrang_Aud', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&q=80', joinedAt: '20 phút trước', txHash: '0xdef...222', slotNumber: 2 },
          { id: 'p3', name: 'QuocBao_Dev', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80', joinedAt: '8 phút trước', txHash: '0x123...333', slotNumber: 3 },
          { id: 'p4', name: 'KhanhLinh_98', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=100&q=80', joinedAt: '1 phút trước', txHash: '0x456...444', slotNumber: 4 }
        ],
        keysVault: [
          { id: 'k1', code: 'https://spotify.com/family/join/invite/cp-771-s1', status: 'reserved' },
          { id: 'k2', code: 'https://spotify.com/family/join/invite/cp-771-s2', status: 'reserved' },
          { id: 'k3', code: 'https://spotify.com/family/join/invite/cp-771-s3', status: 'reserved' },
          { id: 'k4', code: 'https://spotify.com/family/join/invite/cp-771-s4', status: 'reserved' },
          { id: 'k5', code: 'https://spotify.com/family/join/invite/cp-771-s5', status: 'available' }
        ]
      }
    ],
    rating: 4.94,
    reviewCount: 820,
    stockAvailable: 50,
    isFlashSale: true,
    flashSaleEnds: '02:35:10',
    flashSaleStockClaimed: 78,
    flashSaleTotalStock: 100,
    tags: ['FLASH SALE', 'SPOTIFY 1 NĂM', 'TIẾT KIỆM 73%', 'LOSSLESS']
  },
  {
    id: 'prod-nordvpn-dedicated',
    title: 'NordVPN 2 Năm Dedicated IP & CyberSec Shield',
    subtitle: 'Bảo mật tuyệt đối cấp độ quân sự, Fake IP 110+ quốc gia, 10 thiết bị cùng lúc',
    category: 'vpn',
    platform: 'NordVPN',
    bannerImg: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80',
    retailPrice: 990000,
    groupPrice: 190000,
    minSlots: 5,
    deliveryType: 'account_invite',
    deliveryEstimate: 'Cấp tài khoản & mã kích hoạt tức thì',
    description: 'Gom đơn NordVPN 2 Năm bản quyền. Tốc độ vượt trội với giao thức NordLynx độc quyền, vượt tường lửa và bảo vệ giao dịch trực tuyến.',
    features: [
      'Tốc độ cao 6730+ Servers tại 111 quốc gia',
      'Tích hợp Threat Protection Pro chặn mã độc và quảng cáo',
      'Chính sách No-Logs đã kiểm toán độc lập',
      'Tương thích Windows, Mac, iOS, Android, Linux'
    ],
    instructions: [
      '1. Đăng nhập tài khoản được cấp trong CyberPool Vault',
      '2. Bật kết nối Quick Connect đến server mong muốn',
      '3. Thoải mái lướt web ẩn danh bảo mật cao'
    ],
    seller: {
      id: 'seller-license-hub',
      name: 'Apex Software Vault',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
      badge: 'Top Merchant',
      rating: 4.96,
      totalDeals: 2150,
      completedPools: 730,
      responseTime: '< 5 phút'
    },
    activePools: [
      {
        id: 'pool-vpn-441',
        productId: 'prod-nordvpn-dedicated',
        title: 'Gom sỉ NordVPN Dedicated 2 Năm Cohort #441',
        targetSlots: 5,
        filledSlots: 3,
        pricePerSlot: 190000,
        retailPrice: 990000,
        savingsPercent: 81,
        expiresAt: '4h 15m',
        status: 'filling',
        hostName: 'SecurityNinja',
        isHot: true,
        participants: [
          { id: 'p1', name: 'SecurityGuy', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80', joinedAt: '1 giờ trước', txHash: '0x991...881', slotNumber: 1 },
          { id: 'p2', name: 'AnDanh_Vn', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=100&q=80', joinedAt: '22 phút trước', txHash: '0x772...662', slotNumber: 2 },
          { id: 'p3', name: 'CyberShield', avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=100&q=80', joinedAt: '5 phút trước', txHash: '0x553...443', slotNumber: 3 }
        ],
        keysVault: [
          { id: 'k1', code: 'NORD-CYBER-2Y-8812-PRO', status: 'reserved' },
          { id: 'k2', code: 'NORD-CYBER-2Y-4491-PRO', status: 'reserved' },
          { id: 'k3', code: 'NORD-CYBER-2Y-3310-PRO', status: 'reserved' },
          { id: 'k4', code: 'NORD-CYBER-2Y-7719-PRO', status: 'available' },
          { id: 'k5', code: 'NORD-CYBER-2Y-9924-PRO', status: 'available' }
        ]
      }
    ],
    rating: 4.95,
    reviewCount: 290,
    stockAvailable: 20,
    isFlashSale: true,
    flashSaleEnds: '03:19:40',
    flashSaleStockClaimed: 86,
    flashSaleTotalStock: 100,
    tags: ['FLASH SALE -81%', 'VPN 2 NĂM', 'BẢO MẬT CYBER', 'NO-LOGS']
  },
  {
    id: 'prod-claude-35-sonnet',
    title: 'Claude 3.5 Sonnet & Opus Team Workspace (30 Ngày)',
    subtitle: 'Artifacts tương tác trực tiếp, 200K context window, tạo web app và phân tích tài liệu siêu tốc',
    category: 'ai_tools',
    platform: 'Anthropic',
    bannerImg: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=800&q=80',
    retailPrice: 580000,
    groupPrice: 125000,
    minSlots: 5,
    deliveryType: 'account_invite',
    deliveryEstimate: 'Gửi link invite Team Workspace trong 1 phút',
    description: 'Mua chung tài khoản Anthropic Claude Pro/Team chính chủ. Hỗ trợ code với Artifacts, đọc hiểu PDF dung lượng lớn và viết content đỉnh cao.',
    features: [
      'Truy cập Claude 3.5 Sonnet V2 & Claude 3.5 Haiku',
      'Môi trường chạy live code Artifacts',
      '200.000 Tokens Context Window',
      'Bảo hành 1:1 trọn vẹn 30 ngày'
    ],
    instructions: [
      '1. Tham gia slot nhóm gom đơn Claude',
      '2. Chấp nhận email invite vào Team Organization',
      '3. Sử dụng đầy đủ tính năng Pro không giới hạn'
    ],
    seller: {
      id: 'seller-neural-01',
      name: 'CyberNeural Lab',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      badge: 'Tesla Verified',
      rating: 4.98,
      totalDeals: 1420,
      completedPools: 890,
      responseTime: '< 2 phút'
    },
    activePools: [
      {
        id: 'pool-claude-220',
        productId: 'prod-claude-35-sonnet',
        title: 'Nhóm Claude 3.5 Sonnet Team Pro #220',
        targetSlots: 5,
        filledSlots: 4,
        pricePerSlot: 125000,
        retailPrice: 580000,
        savingsPercent: 78,
        expiresAt: '35m 12s',
        status: 'filling',
        hostName: 'Anthropic_Pro',
        isHot: true,
        participants: [
          { id: 'p1', name: 'VietAI_Engineer', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80', joinedAt: '45 phút trước', txHash: '0xcc1...111', slotNumber: 1 },
          { id: 'p2', name: 'HoangDev', avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=100&q=80', joinedAt: '25 phút trước', txHash: '0xee2...222', slotNumber: 2 },
          { id: 'p3', name: 'MinhTrang_Prompt', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=100&q=80', joinedAt: '12 phút trước', txHash: '0xff3...333', slotNumber: 3 },
          { id: 'p4', name: 'TanPhuoc_Code', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80', joinedAt: '2 phút trước', txHash: '0xaa4...444', slotNumber: 4 }
        ],
        keysVault: [
          { id: 'k1', code: 'https://claude.ai/team/invite/cp-220-s1', status: 'reserved' },
          { id: 'k2', code: 'https://claude.ai/team/invite/cp-220-s2', status: 'reserved' },
          { id: 'k3', code: 'https://claude.ai/team/invite/cp-220-s3', status: 'reserved' },
          { id: 'k4', code: 'https://claude.ai/team/invite/cp-220-s4', status: 'reserved' },
          { id: 'k5', code: 'https://claude.ai/team/invite/cp-220-s5', status: 'available' }
        ]
      }
    ],
    rating: 4.99,
    reviewCount: 470,
    stockAvailable: 22,
    isFlashSale: true,
    flashSaleEnds: '01:50:22',
    flashSaleStockClaimed: 95,
    flashSaleTotalStock: 100,
    tags: ['FLASH SALE -78%', 'CLAUDE 3.5', 'ARTIFACTS', 'AI PRO']
  }
];

export const INITIAL_ORDERS: import('../types').UserOrder[] = [
  {
    id: 'ord-giftup-88912',
    productId: 'prod-giftup-card-50',
    productTitle: 'Thẻ Quà Tặng Số GiftUp Card $50 USD (Digital Voucher)',
    platform: 'GiftUp',
    type: 'group_buy',
    pricePaid: 720000,
    status: 'fulfilled',
    createdAt: '2026-08-20 14:32:00',
    deliveredKey: 'GU-50USD-8891-3320-1091',
    pinCode: '4821',
    giftUpCard: {
      cardNumber: '4928 8812 3390 1091',
      pinCode: '4821',
      barcode: 'GU-9901-8823-112',
      balance: 50,
      currency: 'USD',
      expiryDate: '12/2028',
      redeemUrl: 'https://giftup.app/redeem/cyberpool-gu-8891'
    },
    txId: 'TX-ELON-9901-F3A'
  },
  {
    id: 'ord-wukong-77123',
    productId: 'prod-black-myth-wukong',
    productTitle: 'Steam Key: Black Myth Wukong (Global Key)',
    platform: 'Steam',
    type: 'group_buy',
    pricePaid: 640000,
    status: 'fulfilled',
    createdAt: '2026-08-19 09:15:00',
    deliveredKey: 'ST-WUK-9812-441A-QXP9',
    txId: 'TX-STEAM-7712-B8E'
  }
];
