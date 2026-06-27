import React, { useState } from 'react';
import { Loader2, Plus, Save, X, Edit2, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { Product, ProductStatus } from '@/types';
import { createClient } from '@/lib/supabase/client';

interface AdminProductsProps {
  products: any[];
  refreshProducts: () => void;
}

export const AdminProducts: React.FC<AdminProductsProps> = ({ products, refreshProducts }) => {
  const supabase = createClient();
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState({ 
    name: '', desc: '', price: '', stock: '', weight: '', images: [] as string[], status: 'active' as ProductStatus 
  });
  const [uploading, setUploading] = useState(false);

  const compressImage = (file: File): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return reject('No canvas context');
        const MAX_WIDTH = 1200;
        let width = img.width;
        let height = img.height;
        if (width > MAX_WIDTH) {
          height *= MAX_WIDTH / width;
          width = MAX_WIDTH;
        }
        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob((blob) => { if (blob) resolve(blob); else reject('Compression failed'); }, 'image/jpeg', 0.8);
      };
      img.onerror = reject;
    });
  };

  const deleteImageFromStorage = async (imageUrl: string) => {
    try {
      const urlParts = imageUrl.split('/');
      const fileName = urlParts[urlParts.length - 1];
      const { error } = await supabase.storage.from('products').remove([fileName]);
      if (error) console.error('Failed to delete image from storage:', error);
      else console.log('✓ Image deleted from storage:', fileName);
    } catch (error) {
      console.error('Error deleting image:', error);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      if (!e.target.files || e.target.files.length === 0) return;
      
      const newImages: string[] = [];
      for (let i = 0; i < e.target.files.length; i++) {
        const file = e.target.files[i];
        const compressedBlob = await compressImage(file);
        
        const productSlug = productForm.name 
          ? productForm.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
          : 'mushroom';
        
        const timestamp = Date.now();
        const seoFileName = `${productSlug}-delhi-ncr-${timestamp}.jpg`;
        const compressedFile = new File([compressedBlob], seoFileName, { type: 'image/jpeg' });
        
        const { error } = await supabase.storage.from('products').upload(seoFileName, compressedFile);
        if (error) throw error;
        
        const { data } = supabase.storage.from('products').getPublicUrl(seoFileName);
        newImages.push(data.publicUrl);
      }
      
      setProductForm(prev => ({ ...prev, images: [...prev.images, ...newImages] }));
      toast.success(`${newImages.length} images optimized & uploaded`);
    } catch (error: any) { 
      toast.error("Upload failed: " + error.message); 
    } finally { 
      setUploading(false); 
    }
  };

  const startEdit = (p: Product) => {
    setEditingProduct(p);
    setProductForm({ 
        name: p.name, desc: p.description, price: p.price.toString(), stock: p.stock.toString(), weight: p.weight, images: p.images, status: p.status 
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (productForm.images.length === 0) throw new Error("At least one image is required");
      
      const payload = {
        name: productForm.name,
        description: productForm.desc,
        price: parseFloat(productForm.price),
        stock: parseInt(productForm.stock),
        weight: productForm.weight,
        images: productForm.images,
        status: productForm.status,
      };

      if (editingProduct) {
        const { error } = await supabase.from('products').update(payload).eq('id', editingProduct.id);
        if (error) throw error;
        toast.success("Product Updated");
      } else {
        const { error } = await supabase.from('products').insert({
            ...payload,
            farming_method: 'Modern Farming',
            slug: productForm.name.toLowerCase().replace(/ /g, '-'),
            is_deleted: false
        });
        if (error) throw error;
        toast.success("Product Created");
      }
      setEditingProduct(null);
      setProductForm({ name: '', desc: '', price: '', stock: '', weight: '', images: [], status: 'active' });
      refreshProducts();
    } catch (err: any) { toast.error(err.message); }
  };

  const handleSoftDelete = async (id: string) => {
    if (!confirm("Delete this product? Images will be permanently deleted from storage.")) return;
    try {
      const product = products.find(p => p.id === id);
      if (product && product.images.length > 0) {
        for (const imageUrl of product.images) {
          await deleteImageFromStorage(imageUrl);
        }
      }
      const { error } = await supabase.from('products').update({ is_deleted: true, status: 'hidden' }).eq('id', id);
      if (error) throw error;
      toast.success("Product and images deleted");
      refreshProducts();
    } catch (error: any) {
      toast.error("Failed: " + error.message);
    }
  };

  return (
    <div className="grid lg:grid-cols-3 gap-8 animate-in fade-in">
      <div className="lg:col-span-1 bg-white dark:bg-brand-darkCream p-6 rounded-2xl shadow-sm border border-brand-cream h-fit sticky top-24">
        <h2 className="font-bold text-xl mb-4 text-brand-text">{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
        <form onSubmit={handleSaveProduct} className="space-y-4">
          <input required placeholder="Name" value={productForm.name} onChange={e=>setProductForm({...productForm, name: e.target.value})} className="w-full p-3 bg-brand-light border border-brand-cream rounded-xl focus:border-brand-brown outline-none" />
          <textarea required placeholder="Description" value={productForm.desc} onChange={e=>setProductForm({...productForm, desc: e.target.value})} className="w-full p-3 bg-brand-light border border-brand-cream rounded-xl h-24 focus:border-brand-brown outline-none" />
          <div className="grid grid-cols-2 gap-4">
            <input required type="number" placeholder="Price (₹)" value={productForm.price} onChange={e=>setProductForm({...productForm, price: e.target.value})} className="w-full p-3 bg-brand-light border border-brand-cream rounded-xl focus:border-brand-brown outline-none" />
            <input required type="number" placeholder="Stock" value={productForm.stock} onChange={e=>setProductForm({...productForm, stock: e.target.value})} className="w-full p-3 bg-brand-light border border-brand-cream rounded-xl focus:border-brand-brown outline-none" />
          </div>
          <input required placeholder="Weight (e.g., 200g)" value={productForm.weight} onChange={e=>setProductForm({...productForm, weight: e.target.value})} className="w-full p-3 bg-brand-light border border-brand-cream rounded-xl focus:border-brand-brown outline-none" />
          <select value={productForm.status} onChange={(e) => setProductForm({...productForm, status: e.target.value as ProductStatus})} className="w-full p-3 bg-brand-light border border-brand-cream rounded-xl focus:border-brand-brown outline-none">
            <option value="active">Active</option>
            <option value="hidden">Hidden</option>
            <option value="coming_soon">Coming Soon</option>
          </select>
          
          <div>
             <label className="text-xs font-bold text-brand-muted uppercase mb-2 block">Images</label>
             <div className="grid grid-cols-3 gap-2 mb-2">
               {productForm.images.map((img, i) => (
                 <div key={i} className="relative group aspect-square rounded-lg overflow-hidden border border-brand-cream">
                   <img src={img} className="w-full h-full object-cover" alt="Product" />
                  <button type="button" onClick={async () => {
                    await deleteImageFromStorage(img);
                    setProductForm(prev => ({...prev, images: prev.images.filter((_, idx) => idx !== i)}));
                    toast.success('Image deleted from storage');
                  }} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <X size={12}/>
                  </button>
                 </div>
               ))}
               <label className="border-2 border-dashed border-brand-cream rounded-lg flex items-center justify-center cursor-pointer hover:bg-brand-light aspect-square transition-colors">
                  <input type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" />
                  {uploading ? <Loader2 className="animate-spin text-brand-brown"/> : <Plus size={24} className="text-brand-muted"/>}
               </label>
             </div>
          </div>

          <div className="flex gap-2">
            <button type="submit" disabled={uploading} className="flex-1 bg-brand-brown text-white font-bold py-3 rounded-xl hover:bg-brand-dark flex items-center justify-center gap-2"><Save size={16}/> Save</button>
            {editingProduct && <button type="button" onClick={()=>{setEditingProduct(null); setProductForm({name:'',desc:'',price:'',stock:'', weight:'',images:[], status:'active'})}} className="bg-brand-light p-3 rounded-xl hover:bg-brand-cream"><X size={20}/></button>}
          </div>
        </form>
      </div>

      <div className="lg:col-span-2 space-y-4">
        {products.filter(p=>!p.is_deleted).map(p => (
          <div key={p.id} className={`bg-white dark:bg-brand-darkCream p-4 rounded-xl border border-brand-cream flex gap-4 ${p.status === 'hidden' ? 'opacity-60 grayscale' : ''}`}>
            <img src={p.images[0]} className="w-20 h-20 object-cover rounded-lg bg-brand-light" alt={p.name} />
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <h4 className="font-bold text-brand-text">{p.name}</h4>
                <div className="flex items-center gap-2">
                   <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${p.status==='active'?'bg-green-100 text-green-700':'bg-brand-cream text-brand-muted'}`}>{p.status.replace('_',' ')}</span>
                   <button onClick={() => startEdit(p)} className="p-1.5 hover:bg-brand-light rounded-lg"><Edit2 size={16} className="text-brand-muted"/></button>
                </div>
              </div>
              <div className="flex gap-6 mt-2 text-sm text-brand-muted">
                <span>Stock: <b className={p.stock<5?'text-red-500':''}>{p.stock}</b></span>
                <span>Price: <b className="text-brand-brown">₹{p.price}</b></span>
              </div>
              <div className="mt-2 text-right">
                 <button onClick={()=>handleSoftDelete(p.id)} className="text-xs text-red-500 hover:text-red-700 font-bold flex items-center justify-end gap-1"><Trash2 size={12}/> Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
