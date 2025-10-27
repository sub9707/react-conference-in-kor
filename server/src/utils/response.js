export function successResponse(data, message = 'Success') {
  return {
    success: true,
    message,
    data
  };
}

export function errorResponse(message, statusCode = 500) {
  return {
    success: false,
    message,
    statusCode
  };
}

export function paginatedResponse(data, page, limit, total) {
  return {
    success: true,
    data,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      totalPages: Math.ceil(total / limit)
    }
  };
}