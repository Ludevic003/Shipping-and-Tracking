import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import pb from '@/lib/pocketbaseClient';
import { toast } from 'sonner';
import { Loader2, AlertCircle, RefreshCw, Package, User, MapPin, Box } from 'lucide-react';
import { generateTrackingNumber } from '@/utils/trackingNumberGenerator.js';

const ShipmentForm = ({ mode = 'add', initialData = null, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const defaultState = {
    tracking_number: '',
    status: 'Pending',
    estimated_delivery_date: '',
    pickup_location: '',
    destination_location: '',
    current_location: '',
    shipment_type: 'regular',
    tracking_notes: '',
    
    sender_name: '',
    sender_email: '',
    sender_contact: '',
    sender_address: '',
    sender_country: '',
    sender_postal_code: '',
    sender_province: '',
    
    receiver_name: '',
    receiver_email: '',
    receiver_contact: '',
    receiver_address: '',
    receiver_country: '',
    receiver_postal_code: '',
    receiver_province: '',
    
    product_name: '',
    product_category: 'General Goods',
    product_description: '',
    product_quantity: 1,
    product_weight: '',
    product_dimensions_length: '',
    product_dimensions_width: '',
    product_dimensions_height: '',
    product_value: 0
  };

  const [formData, setFormData] = useState(defaultState);

  useEffect(() => {
    if (mode === 'add' && !formData.tracking_number) {
      handleGenerateTracking();
    }
  }, [mode]);

  useEffect(() => {
    if (mode === 'edit' && initialData) {
      // Format date for input field if it exists
      let formattedDate = initialData.estimated_delivery_date || '';
      if (formattedDate && formattedDate.includes(' ')) {
        formattedDate = formattedDate.split(' ')[0];
      } else if (formattedDate && formattedDate.includes('T')) {
        formattedDate = formattedDate.split('T')[0];
      }

      setFormData({
        ...defaultState,
        ...initialData,
        estimated_delivery_date: formattedDate
      });
    }
  }, [mode, initialData]);

  const handleGenerateTracking = () => {
    const origin = formData.sender_country || 'US';
    const dest = formData.receiver_country || 'US';
    const newTracking = generateTrackingNumber(origin, dest);
    setFormData(prev => ({ ...prev, tracking_number: newTracking }));
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? (value === '' ? '' : Number(value)) : value
    }));
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!formData.tracking_number || !formData.status) {
        throw new Error("Tracking number and status are required.");
      }

      // Clean up numeric fields to ensure they are numbers or null
      const payload = { ...formData };
      const numericFields = [
        'product_quantity', 'product_weight', 'product_dimensions_length', 
        'product_dimensions_width', 'product_dimensions_height', 'product_value'
      ];
      
      numericFields.forEach(field => {
        if (payload[field] === '' || payload[field] === null || isNaN(payload[field])) {
          payload[field] = 0;
        } else {
          payload[field] = Number(payload[field]);
        }
      });

      if (mode === 'add') {
        const record = await pb.collection('shipments_v2').create(payload, { $autoCancel: false });
        toast.success(`Shipment created! Tracking: ${record.tracking_number}`);
        setFormData(defaultState);
        handleGenerateTracking();
      } else {
        await pb.collection('shipments_v2').update(initialData.id, payload, { $autoCancel: false });
        toast.success('Shipment updated successfully!');
      }

      if (onSuccess) onSuccess();
    } catch (err) {
      console.error("Form submission error:", err);
      setError(err.message || 'An error occurred while saving the shipment.');
      toast.error('Failed to save shipment details');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="bg-destructive/10 text-destructive text-sm p-4 rounded-lg font-medium border border-destructive/20 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" /> 
          <div className="flex-1">{error}</div>
        </div>
      )}

      {/* Shipment Details */}
      <Card className="shadow-sm border-border/50 overflow-hidden">
        <CardHeader className="bg-slate-50 border-b border-border/50 pb-4">
          <CardTitle className="text-lg flex items-center gap-2">
            <Package className="w-5 h-5 text-primary" /> Shipment Information
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
          <div className="space-y-2">
            <Label htmlFor="tracking_number">Tracking Number *</Label>
            <div className="flex gap-2">
              <Input
                id="tracking_number"
                name="tracking_number"
                value={formData.tracking_number}
                onChange={handleChange}
                required
                className="font-mono bg-slate-50"
              />
              {mode === 'add' && (
                <Button type="button" variant="outline" onClick={handleGenerateTracking} title="Regenerate">
                  <RefreshCw className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">Status *</Label>
            <Select name="status" value={formData.status} onValueChange={(v) => handleSelectChange('status', v)} disabled={loading}>
              <SelectTrigger id="status"><SelectValue placeholder="Select Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Order has been picked up">Order has been picked up</SelectItem>
                <SelectItem value="In Transit">In Transit</SelectItem>
                <SelectItem value="Out for Delivery">Out for Delivery</SelectItem>
                <SelectItem value="On Hold">On Hold</SelectItem>
                <SelectItem value="In Custom Clearing">In Custom Clearing</SelectItem>
                <SelectItem value="Delivery Attempt">Delivery Attempt</SelectItem>
                <SelectItem value="Delivered">Delivered</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="pickup_location">Pickup Location</Label>
            <Input id="pickup_location" name="pickup_location" value={formData.pickup_location} onChange={handleChange} disabled={loading} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="destination_location">Destination Location</Label>
            <Input id="destination_location" name="destination_location" value={formData.destination_location} onChange={handleChange} disabled={loading} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="current_location">Current Location</Label>
            <Input id="current_location" name="current_location" value={formData.current_location} onChange={handleChange} disabled={loading} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="estimated_delivery_date">Estimated Delivery Date</Label>
            <Input id="estimated_delivery_date" name="estimated_delivery_date" type="date" value={formData.estimated_delivery_date} onChange={handleChange} disabled={loading} />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="tracking_notes">Tracking Notes</Label>
            <Textarea id="tracking_notes" name="tracking_notes" value={formData.tracking_notes} onChange={handleChange} disabled={loading} className="resize-none" />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Sender Details */}
        <Card className="shadow-sm border-border/50 overflow-hidden">
          <CardHeader className="bg-slate-50 border-b border-border/50 pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <User className="w-5 h-5 text-primary" /> Sender Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <div className="space-y-2">
              <Label htmlFor="sender_name">Full Name</Label>
              <Input id="sender_name" name="sender_name" value={formData.sender_name} onChange={handleChange} disabled={loading} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sender_email">Email</Label>
                <Input id="sender_email" name="sender_email" type="email" value={formData.sender_email} onChange={handleChange} disabled={loading} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sender_contact">Phone</Label>
                <Input id="sender_contact" name="sender_contact" value={formData.sender_contact} onChange={handleChange} disabled={loading} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="sender_address">Address</Label>
              <Input id="sender_address" name="sender_address" value={formData.sender_address} onChange={handleChange} disabled={loading} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sender_country">Country</Label>
                <Input id="sender_country" name="sender_country" value={formData.sender_country} onChange={handleChange} disabled={loading} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sender_province">State/Province</Label>
                <Input id="sender_province" name="sender_province" value={formData.sender_province} onChange={handleChange} disabled={loading} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="sender_postal_code">Postal Code</Label>
              <Input id="sender_postal_code" name="sender_postal_code" value={formData.sender_postal_code} onChange={handleChange} disabled={loading} />
            </div>
          </CardContent>
        </Card>

        {/* Receiver Details */}
        <Card className="shadow-sm border-border/50 overflow-hidden">
          <CardHeader className="bg-slate-50 border-b border-border/50 pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" /> Receiver Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <div className="space-y-2">
              <Label htmlFor="receiver_name">Full Name</Label>
              <Input id="receiver_name" name="receiver_name" value={formData.receiver_name} onChange={handleChange} disabled={loading} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="receiver_email">Email</Label>
                <Input id="receiver_email" name="receiver_email" type="email" value={formData.receiver_email} onChange={handleChange} disabled={loading} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="receiver_contact">Phone</Label>
                <Input id="receiver_contact" name="receiver_contact" value={formData.receiver_contact} onChange={handleChange} disabled={loading} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="receiver_address">Address</Label>
              <Input id="receiver_address" name="receiver_address" value={formData.receiver_address} onChange={handleChange} disabled={loading} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="receiver_country">Country</Label>
                <Input id="receiver_country" name="receiver_country" value={formData.receiver_country} onChange={handleChange} disabled={loading} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="receiver_province">State/Province</Label>
                <Input id="receiver_province" name="receiver_province" value={formData.receiver_province} onChange={handleChange} disabled={loading} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="receiver_postal_code">Postal Code</Label>
              <Input id="receiver_postal_code" name="receiver_postal_code" value={formData.receiver_postal_code} onChange={handleChange} disabled={loading} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Product Details */}
      <Card className="shadow-sm border-border/50 overflow-hidden">
        <CardHeader className="bg-slate-50 border-b border-border/50 pb-4">
          <CardTitle className="text-lg flex items-center gap-2">
            <Box className="w-5 h-5 text-primary" /> Product Details
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="product_name">Product Name</Label>
            <Input id="product_name" name="product_name" value={formData.product_name} onChange={handleChange} disabled={loading} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="product_category">Category</Label>
            <Select name="product_category" value={formData.product_category} onValueChange={(v) => handleSelectChange('product_category', v)} disabled={loading}>
              <SelectTrigger id="product_category"><SelectValue placeholder="Select Category" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="General Goods">General Goods</SelectItem>
                <SelectItem value="Live Animal">Live Animal</SelectItem>
                <SelectItem value="Electronics">Electronics</SelectItem>
                <SelectItem value="Fragile Items">Fragile Items</SelectItem>
                <SelectItem value="Documents">Documents</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="shipment_type">Shipment Type</Label>
            <Select name="shipment_type" value={formData.shipment_type} onValueChange={(v) => handleSelectChange('shipment_type', v)} disabled={loading}>
              <SelectTrigger id="shipment_type"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="regular">Regular Shipment</SelectItem>
                <SelectItem value="live_animal">Live Animal</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="product_description">Description</Label>
            <Textarea id="product_description" name="product_description" value={formData.product_description} onChange={handleChange} disabled={loading} className="resize-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="product_quantity">Quantity</Label>
              <Input id="product_quantity" name="product_quantity" type="number" min="1" value={formData.product_quantity} onChange={handleChange} disabled={loading} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="product_value">Declared Value ($)</Label>
              <Input id="product_value" name="product_value" type="number" step="0.01" min="0" value={formData.product_value} onChange={handleChange} disabled={loading} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="product_weight">Weight (kg)</Label>
            <Input id="product_weight" name="product_weight" type="number" step="0.01" min="0" value={formData.product_weight} onChange={handleChange} disabled={loading} />
          </div>
          <div className="grid grid-cols-3 gap-2 md:col-span-2">
            <div className="space-y-2">
              <Label htmlFor="product_dimensions_length">Length (cm)</Label>
              <Input id="product_dimensions_length" name="product_dimensions_length" type="number" step="0.1" min="0" value={formData.product_dimensions_length} onChange={handleChange} disabled={loading} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="product_dimensions_width">Width (cm)</Label>
              <Input id="product_dimensions_width" name="product_dimensions_width" type="number" step="0.1" min="0" value={formData.product_dimensions_width} onChange={handleChange} disabled={loading} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="product_dimensions_height">Height (cm)</Label>
              <Input id="product_dimensions_height" name="product_dimensions_height" type="number" step="0.1" min="0" value={formData.product_dimensions_height} onChange={handleChange} disabled={loading} />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end pt-4">
        <Button type="submit" size="lg" className="w-full md:w-auto min-h-[48px] px-8" disabled={loading}>
          {loading ? <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Saving...</> : (mode === 'add' ? 'Create Shipment' : 'Update Shipment')}
        </Button>
      </div>
    </form>
  );
};

export default ShipmentForm;