export const authOptions = {
  accessTokenKey: 'accessToken',
  refreshTokenKey: 'refreshToken',
};

export const defaultImage = {
  contact: {
    logo: '/assets/images/avatar/default-avatar.png',
  },
  employee: {
    logo: '/assets/images/avatar/default-avatar.png',
  },
  company: {
    logo: '/assets/images/default-images/image.svg',
    cover: '/assets/images/default-images/companyCover.jpeg',
    documents: {
      image: '/assets/images/default-images/image.svg',
    },
  },
};

export const imageSize = {
  employee: {
    logo: 150,
  },
  contact: {
    image: 80,
  },
  company: {
    logo: 150,
    cover: { width: 1500, height: 375 },
    slug: {
      width: 330,
      height: 90,
    },
    documents: {
      image: 80,
    },
  },
};

export const allowedDocumentsFormats = {
  msWordDocuments: ['application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  msExelDocuments: ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
  msPowerPointDocuments: [
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  ],
  iWorkPages: ['application/x-iwork-pages-sffpages'],
  iWorkNumber: ['application/x-iwork-keynote-sffnumbers'],
  iWorkKeynote: ['application/x-iwork-keynote-sffkey'],
  images: [
    'image/jpeg',
    'image/x-citrix-jpeg',
    'image/png',
    'image/x-citrix-png',
    'image/x-png',
    'image/vnd.djvu',
    'image/svg+xml',
  ],
  video: ['video/x-ms-wmv', 'video/quicktime', 'video/x-msvideo', 'video/avi', 'video/mp4', 'application/mp4'],
  archives: [
    'application/zip',
    'application/zip-compressed',
    'application/x-zip-compressed',
    'application/x-7z-compressed',
    'application/rar',
    'application/octet-stream',
    'application/x-rar',
    'application/x-tar',
    'application/x-rar-compressed',
  ],
  pdfDocuments: ['application/pdf'],
  photoshopDocument: ['image/vnd.adobe.photoshop'],
};

export const appVersionKey = 'appVersion';

export const maxFileSize = 15e6;
