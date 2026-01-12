import { environment } from '../../environment/environment';

export class API_END_POINTS {
  public static about = {
    postAbout: `${environment.serverBaseUrl}/about`,
    getAboutById: `${environment.serverBaseUrl}/about`,
  };

  public static admin = {
    getAllCourseRequest: `${environment.serverBaseUrl}/admin/course/requests`,
    courseRequestChangeStatus: `${environment.serverBaseUrl}/admin/course/requests`,
    getAllEventsRequest: `${environment.serverBaseUrl}/admin/events/requests`,
    changeEventRequestStatus: `${environment.serverBaseUrl}/admin/events/requests`,
    getAllProductRequests: `${environment.serverBaseUrl}/admin/product/requests`,
    changeProductRequestStatus: `${environment.serverBaseUrl}/admin/product/requests`,
  };

  public static appointment = {
    postBookAppointment: `${environment.serverBaseUrl}/appointment`,
    deleteAppointment: `${environment.serverBaseUrl}/appointment`,
    approveAppointment: `${environment.serverBaseUrl}/appointment`,
    rejectAppointment: `${environment.serverBaseUrl}/appointment`,
    getTrainerAppointments: `${environment.serverBaseUrl}/appointment/trainer`,
  };

  public static auth = {
    login: `${environment.serverBaseUrl}/registration/login`,
    signup: `${environment.serverBaseUrl}/registration`,
    forgotPassword: `${environment.serverBaseUrl}/registration/forget-password`,
    resetPassword: `${environment.serverBaseUrl}/registration/reset-password`,
  };

  public static blog = {
    getAllBlogs: `${environment.serverBaseUrl}/blog`,
    getBlogById: (id: string) => `${environment.serverBaseUrl}/blog/${id}`,
  };

  public static cart = {
    postToCart: `${environment.serverBaseUrl}/cart/add`,
    getCartProducts: `${environment.serverBaseUrl}/cart`,
    deleteCartProductById: (productId: string) =>
      `${environment.serverBaseUrl}/cart/remove/${productId}`,
  };

  public static category = {
    postCategory: `${environment.serverBaseUrl}/category`,
    getAllCategory: `${environment.serverBaseUrl}/beforeLogin/allcategory`,
    getCategoryById: `${environment.serverBaseUrl}/category`,
    updateCategory: `${environment.serverBaseUrl}/category/update`,
    deleteCategory: `${environment.serverBaseUrl}/category`,
    postSubCategory: `${environment.serverBaseUrl}/category/sub-category`,
    getSubCategory: `${environment.serverBaseUrl}/category`,
    updateSubCategory: `${environment.serverBaseUrl}/category/update-sub-categories`,
  };

  public static course = {
    postCourse: `${environment.serverBaseUrl}/course`,
    getCourse: `${environment.serverBaseUrl}/course`,
    getCourseById: `${environment.serverBaseUrl}/course`,
    updateCourse: `${environment.serverBaseUrl}/course`,
    deleteCourse: `${environment.serverBaseUrl}/course`,

    getAllCourses: (page: number, limit: number,filter:any) =>
      `${environment.serverBaseUrl}/beforeLogin/allcourses?filter=${filter}&page=${page}&limit=${limit}`,

    filterCourses: (
      page: number,
      limit: number,
      categories?: string,
      filterType?: string
    ) =>
      `${environment.serverBaseUrl}/filter/courses?categories=${
        categories || ''
      }&filterType=${filterType || ''}&page=${page}&limit=${limit}`,

    // without token
    getCoursesById: (id: string) =>
      `${environment.serverBaseUrl}/beforeLogin/course/${id}`,

    getBySubcategory: (subcategoryId: string, page: number, limit: number) =>
      `${environment.serverBaseUrl}/getCourseBySubCategory?sub_category=${subcategoryId}&page=${page}&limit=${limit}`,

    getCoursesByTrainerId: `${environment.serverBaseUrl}/getCoursetrainerDashboard`,
    getOngoingCourses: `${environment.serverBaseUrl}/my_ongoing_courses`,
    getCompleteCourses: `${environment.serverBaseUrl}/my_completed_courses`,
    viewRequestCourseById: `${environment.serverBaseUrl}/course`,
  };

  public static dashboard = {
    getDashboardData: `${environment.serverBaseUrl}/dashboard`,
    getAdminDashboardCounts: `${environment.serverBaseUrl}/admin/s/dashboard-counts`,
  };

  public static education = {
    postEducation: `${environment.serverBaseUrl}/education`,
    getEducation: `${environment.serverBaseUrl}/education`,
    updateEducation: `${environment.serverBaseUrl}/education`,
    getEducationById: `${environment.serverBaseUrl}/education`,
    getEducationDetails: `${environment.serverBaseUrl}/education`,
    updateEducationDetails: `${environment.serverBaseUrl}/education`,
  };

  public static event = {
    getAllEvents: (page: number, limit: number) =>
      `${environment.serverBaseUrl}/beforeLogin/allevents?page=${page}&limit=${limit}`,

    filterEvents: (
      page: number,
      limit: number,
      categories: string = '',
      filterType: string = ''
    ) =>
      `${environment.serverBaseUrl}/event/filter/event?categories=${categories}&filterType=${filterType}&page=${page}&limit=${limit}`,

    getEventById: (id: string) =>
      `${environment.serverBaseUrl}/beforeLogin/event/${id}`,
    registerEvent: `${environment.serverBaseUrl}/event/registerevent`,
    getEventByTrainerId: `${environment.serverBaseUrl}/event/getEvent/getEventTrainerdashboard`,
    getEventData: `${environment.serverBaseUrl}/trainers`,
    addEvent: `${environment.serverBaseUrl}/event`,
    viewRequestEventById: `${environment.serverBaseUrl}/event`,
    deleteEvent: `${environment.serverBaseUrl}/event`,
    getEventByID: `${environment.serverBaseUrl}/event`,
    updateEventByID: `${environment.serverBaseUrl}/event`,
    getRegisteredEvents: `${environment.serverBaseUrl}/event/registered`,
    getAllEventsOnProfilePage: `${environment.serverBaseUrl}/event/bytrainer`,
  };

  public static footer = {
    getFooterCourse: `${environment.serverBaseUrl}/footer/courses`
  }

  public static enquiries = {
    postEnquiry: `${environment.serverBaseUrl}/enquiries`,
    deleteEnquiry: `${environment.serverBaseUrl}/enquiries`,
    getEnquiries: `${environment.serverBaseUrl}/enquiries/trainer`,
    markseenbyid: `${environment.serverBaseUrl}/enquiries`,
    markallseen: `${environment.serverBaseUrl}/enquiries`,
    getallunseeninquiry: `${environment.serverBaseUrl}/enquiries`,
    postEnquiryreply: `${environment.serverBaseUrl}/enquiries/reply`,
  };

  public static enrollment = {
    enrollCourse: `${environment.serverBaseUrl}/enrollcourse`,
  };

  public static forum = {
    getAllForums: `${environment.serverBaseUrl}/forum`,
    getForumById: (id: string) => `${environment.serverBaseUrl}/forum/${id}`,
    addForum: `${environment.serverBaseUrl}/forum/add`,
    postAnswer: `${environment.serverBaseUrl}/forum/postanswer`,
    Addreply: (id: string) =>
      `${environment.serverBaseUrl}/forum/reply?forumid=${id}`,
    likedislike: (id: string) =>
      `${environment.serverBaseUrl}/forum/likedislike/${id}`,
    likedislikeForReply: (id: string) =>
      `${environment.serverBaseUrl}/forum/likedislikeReply/${id}`,
    getForumReplyById: (id: string) =>
      `${environment.serverBaseUrl}/forum/reply/${id}`,
    shareForumReplycount: (id: string) =>
      `${environment.serverBaseUrl}/forum/shareComment/${id}`,
    shareforumcount: (id: string) =>
      `${environment.serverBaseUrl}/forum/shareCount/${id}`,
  };

  public static gallery = {
    postGallery: `${environment.serverBaseUrl}/gallary`,
  };

  public static home = {
    getHome: (page: number, limit: number) =>
      `${environment.serverBaseUrl}/beforeLogin/home?page=${page}&limit=${limit}`,
  };

  public static institute = {
    postInstitute: `${environment.serverBaseUrl}institute`,
    getInstitute: `${environment.serverBaseUrl}institute`,
    updateInstitute: `${environment.serverBaseUrl}institute`,
    registerInstitute: `${environment.serverBaseUrl}/institute`,
    createInstitute: `${environment.serverBaseUrl}/institute/create-institute`,
    getInstitutes: `${environment.serverBaseUrl}/institute/get-institutes`,
    getInstituteProfile: `${environment.serverBaseUrl}/institute/instituteProfile`,
    updateInstituteDetails: `${environment.serverBaseUrl}/institute/instituteUpdateProfile`,
    updateInstituteProfile: `${environment.serverBaseUrl}/institute/instituteProfile`,
    postInstituteSocialLinks: `${environment.serverBaseUrl}/institute/social-media`,
    getSocialMedia: `${environment.serverBaseUrl}/institute/social-media`,
    getInstituteProfiles: `${environment.serverBaseUrl}/institute/getInstituteProfile`,
  };

  public static instituteAuth = {
    login: `${environment.serverBaseUrl}/institute/instituteLogin`,
  };

  public static inquiry = {
    submitInquiry: `${environment.serverBaseUrl}/inquiry`,
  };

  public static login = {
    studentLogin: `${environment.serverBaseUrl}/student/login`,
    studentRegister: `${environment.serverBaseUrl}/student/register`,
  };

  public static location = {
    getAllLocation: (data: any) =>
      `${environment.serverBaseUrl}/location?query=${data}`,
  };

  public static notification = {
    getUnseenNotifications: `${environment.serverBaseUrl}/notifications/unseen`,
    getAllUnseenNotifications: `${environment.serverBaseUrl}/notifications/all-unseen`,
    updateNotificationStatus: `${environment.serverBaseUrl}/notifications/view`,
    getUnseenNotificationCount: `${environment.serverBaseUrl}/notifications/unseen-count`,
  };

  public static product = {
    getAllProducts: (page: number, limit: number) =>
      `${environment.serverBaseUrl}/beforeLogin/allproduct?page=${page}&limit=${limit}`,

    filterProducts: (
      page: number,
      limit: number,
      categories?: string,
      filterType?: string
    ) =>
      `${environment.serverBaseUrl}/product/filter/product?categories=${
        categories || ''
      }&filterType=${filterType || ''}&page=${page}&limit=${limit}`,

    getProductById: (id: string) =>
      `${environment.serverBaseUrl}/beforeLogin/product/${id}`,
    postRegisterProduct: `${environment.serverBaseUrl}/product/registerproduct`,
    getAllProductsByTrainerId: `${environment.serverBaseUrl}/product/getproduct/trainer`,
    addProduct: `${environment.serverBaseUrl}/product`,
    viewProductRequestById: `${environment.serverBaseUrl}/product`,
    deleteProduct: `${environment.serverBaseUrl}/product`,
    getProductByID: `${environment.serverBaseUrl}/product`,
    updateProduct: `${environment.serverBaseUrl}/product`,
    getRegisteredProductData: `${environment.serverBaseUrl}/product/get/my-registered-product`,
    getAllProductsOnProfilePage: `${environment.serverBaseUrl}/product/bytrainer`,
  };

  public static questions = {
    postQuestion: `${environment.serverBaseUrl}/questions`,
    deleteQuestion: `${environment.serverBaseUrl}/questions`,
    getTrainerQuestions: `${environment.serverBaseUrl}/questions/trainer`,
    replyToQuestion: `${environment.serverBaseUrl}/questions/reply`,
    markallread: `${environment.serverBaseUrl}/questions`,
    markreadbyId: `${environment.serverBaseUrl}/questions`,
    statusgetdata: `${environment.serverBaseUrl}/questions`,
    getallunseenquestion: `${environment.serverBaseUrl}/questions`,
  };

  public static review = {
    getCourseReview: (id: string, page: number, limit: number) =>
      `${environment.serverBaseUrl}/review/course/${id}?page=${page}&limit=${limit}`,

    postEventReview: `${environment.serverBaseUrl}/review/event`,
    getEventReview: `${environment.serverBaseUrl}/review/event`,
    postProductReview: `${environment.serverBaseUrl}/review/product`,
    getProductReview: `${environment.serverBaseUrl}/review/product`,
    postReview: `${environment.serverBaseUrl}/review`,
    postCourseReview: `${environment.serverBaseUrl}/review/course`,
    getTrainerReviews: `${environment.serverBaseUrl}/review/trainerDashboard/review`,
    replyTrainerReviews: `${environment.serverBaseUrl}/review`,
    markallseen: `${environment.serverBaseUrl}/review`,
    markseenid: `${environment.serverBaseUrl}/review`,
  };

  public static skills = {
    postSkills: `${environment.serverBaseUrl}/registration/addskills`,
  };

  public static search = {
    getBreadCrumb: `${environment.serverBaseUrl}/search/getbreadcrumb`,
    globalSearch: `${environment.serverBaseUrl}/search/global`,
    searchStudentByName: (search: string) =>
      `${environment.serverBaseUrl}/Search/student?search=${search}`,
    searchTrainer_Institute_ByName: (search: string) =>
      `${environment.serverBaseUrl}/institute/institute-byname?search=${search}`,
  };

  public static testimonial = {
    postTestimonial: `${environment.serverBaseUrl}/testmonial`,
  };

  public static trainer = {
    getTrainer: `${environment.serverBaseUrl}/trainer`,
    getTrainers: (page: number, limit: number) =>
      `${environment.serverBaseUrl}/beforeLogin/trainers?page=${page}&limit=${limit}`,
    filterTrainers: (page: number, limit: number, cat: string, id: string) =>
      `${environment.serverBaseUrl}/institute/instituteByCategory/${id}?page=${page}&limit=${limit}`,
    getTrainerById: `${environment.serverBaseUrl}/registration/trainer`,
    updateTrainerDetails: `${environment.serverBaseUrl}/registration/update`,
    getTrainerDataById: `${environment.serverBaseUrl}/trainers`,
    getTrainerProfileById: `${environment.serverBaseUrl}/trainerbyid`,
    getAllCoursesOnProfilePage: `${environment.serverBaseUrl}/trainer/courses`,
    filterBySubCategory: `${environment.serverBaseUrl}/institute/instituteBySubCategories`,
  };

  public static user = {
    requestRoleChange: `${environment.serverBaseUrl}/auth/request-role-change`,
    getPendingRoleRequests: `${environment.serverBaseUrl}/auth/all-pending-request`,
    getApprovedRoleRequests: `${environment.serverBaseUrl}/auth/all-approved-request`,
    getRejectedRoleRequests: `${environment.serverBaseUrl}/auth/all-rejected-request`,
    approveRoleChange: `${environment.serverBaseUrl}/auth/approve-role-change`,
    getUserDetails: (id: string) =>
      `${environment.serverBaseUrl}/registration/get-user-info/${id}`,
  };

  public static seo = {
    getFooterData: `${environment.serverBaseUrl}/footer`,
    getCoursesBySubcategory: (subCategoryIds: string) =>
      `${environment.serverBaseUrl}/footer/courses?sub_category_ids=${subCategoryIds}`,
  };

  public static student = {
    getStudentDataById: `${environment.serverBaseUrl}/enrollcourse/student`,
  };

  public static chat = {
    getAllchat: `${environment.serverBaseUrl}/chat`,
    Addchat: `${environment.serverBaseUrl}/chat`,
    getmessage: (id: string) => `${environment.serverBaseUrl}/message/${id}`,
    sendmessage: `${environment.serverBaseUrl}/message`,
    postComment: `${environment.serverBaseUrl}/course_comment`,
  };
}
