import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UploadCloud, X, Send } from 'lucide-react';
import pb from '@/lib/pocketbaseClient';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext.jsx';

const ComplaintForm = ({ shipmentId, onSuccess }) => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    complaint_type: '',
    description: ''
  });
  const [files, setFiles] = useState([]);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (files.length + selectedFiles.length > 3) {
      toast.error('Maximum 3 attachments allowed');
      return;
    }
    
    const validFiles = selectedFiles.filter(file => {
      if (file.size > 20 * 1024 * 1024) {
        toast.error(`${file.name} exceeds 20MB limit`);
        return false;
      }
      return true;
    });

    setFiles(prev => [...prev, ...validFiles]);
  };

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.complaint_type) {
      toast.error('Please select a complaint type');
      return;
    }

    setLoading(true);
    try {
      const data = new FormData();
      data.append('shipment_id', shipmentId);
      data.append('user_email', currentUser.email);
      data.append('complaint_type', formData.complaint_type);
      data.append('description', formData.description);
      data.append('status', 'Open');
      
      files.forEach(file => {
        data.append('attachments', file);
      });

      await pb.collection('complaint_tickets').create(data, { $autoCancel: false });
      
      toast.success('Complaint submitted successfully');
      setFormData({ complaint_type: '', description: '' });
      setFiles([]);
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error(error);
      toast.error(error.message || 'Failed to submit complaint');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="complaint_type">Issue Type *</Label>
        <Select 
          value={formData.complaint_type} 
          onValueChange={(val) => setFormData(prev => ({ ...prev, complaint_type: val }))}
          disabled={loading}
        >
          <SelectTrigger className="h-12">
            <SelectValue placeholder="Select the type of issue" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Damage">Damaged Package/Items</SelectItem>
            <SelectItem value="Delay">Severe Delay</SelectItem>
            <SelectItem value="Lost Package">Lost Package</SelectItem>
            <SelectItem value="Other">Other Issue</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Detailed Description *</Label>
        <Textarea
          id="description"
          placeholder="Please provide as much detail as possible about the issue..."
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          required
          disabled={loading}
          className="min-h-[120px] resize-y"
        />
      </div>

      <div className="space-y-4">
        <Label>Attachments (Photos/Documents - Max 3)</Label>
        <div className="flex items-center justify-center w-full">
          <label htmlFor="file-upload" className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer bg-muted/30 hover:bg-muted/50 transition-colors ${loading ? 'opacity-50 pointer-events-none' : ''}`}>
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <UploadCloud className="w-8 h-8 mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground"><span className="font-semibold">Click to upload</span> or drag and drop</p>
            </div>
            <input 
              id="file-upload" 
              type="file" 
              className="hidden" 
              multiple 
              onChange={handleFileChange}
              disabled={loading}
            />
          </label>
        </div>

        {files.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
            {files.map((file, index) => (
              <div key={index} className="flex items-center justify-between p-2 border rounded-lg bg-background">
                <span className="text-xs truncate max-w-[120px]">{file.name}</span>
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="text-destructive hover:bg-destructive/10 p-1 rounded"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <Button type="submit" className="w-full h-12" disabled={loading}>
        {loading ? 'Submitting...' : (
          <>
            <Send className="w-4 h-4 mr-2" />
            Submit Complaint
          </>
        )}
      </Button>
    </form>
  );
};

export default ComplaintForm;