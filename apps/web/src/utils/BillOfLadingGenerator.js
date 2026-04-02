export const generateBLNumber = () => {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `BL-${timestamp}-${random}`;
};

export const generateBLContent = (shipmentData) => {
  return `
    BILL OF LADING
    Tracking: ${shipmentData.tracking_number}
    Date: ${new Date().toLocaleDateString()}
    
    SENDER:
    ${shipmentData.sender_name || 'N/A'}
    ${shipmentData.sender_address || 'N/A'}, ${shipmentData.sender_province || 'N/A'}, ${shipmentData.sender_country || 'N/A'}
    Phone: ${shipmentData.sender_contact || 'N/A'}
    
    RECEIVER:
    ${shipmentData.receiver_name || 'N/A'}
    ${shipmentData.receiver_address || 'N/A'}, ${shipmentData.receiver_province || 'N/A'}, ${shipmentData.receiver_country || 'N/A'}
    Phone: ${shipmentData.receiver_contact || 'N/A'}
    
    PRODUCT DETAILS:
    Item: ${shipmentData.product_name || 'N/A'}
    Quantity: ${shipmentData.product_quantity || 1}
    Weight: ${shipmentData.product_weight || 'N/A'} kg
    Dimensions: ${shipmentData.product_dimensions_length || 0}x${shipmentData.product_dimensions_width || 0}x${shipmentData.product_dimensions_height || 0} cm
    Value: $${shipmentData.product_value || 0}
    
    TERMS: Standard shipping terms and conditions apply.
  `;
};