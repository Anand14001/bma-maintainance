import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Label } from '../ui/label';
import { toast } from 'sonner';
import { Check } from 'lucide-react';

export default function AppearanceSection() {
    const [selectedColor, setSelectedColor] = useState('#3b82f6');
    const [selectedFont, setSelectedFont] = useState('inter');
    const [selectedTemplate, setSelectedTemplate] = useState('light');

    const colors = [
        { value: '#3b82f6', label: 'Blue' },
        { value: '#8b5cf6', label: 'Purple' },
        { value: '#ec4899', label: 'Pink' },
        { value: '#10b981', label: 'Green' },
        { value: '#f59e0b', label: 'Orange' },
        { value: '#ef4444', label: 'Red' },
    ];

    const fonts = [
        { value: 'inter', label: 'Inter', preview: 'The quick brown fox jumps' },
        { value: 'roboto', label: 'Roboto', preview: 'The quick brown fox jumps' },
        { value: 'poppins', label: 'Poppins', preview: 'The quick brown fox jumps' },
        { value: 'outfit', label: 'Outfit', preview: 'The quick brown fox jumps' },
    ];

    const templates = [
        { value: 'light', label: 'Light', description: 'Clean and bright interface' },
        { value: 'dark', label: 'Dark', description: 'Easy on the eyes' },
        { value: 'auto', label: 'Auto', description: 'Matches system preference' },
    ];

    const handleColorChange = (color) => {
        setSelectedColor(color);
        toast.info('Color theme customization - Coming soon');
    };

    const handleFontChange = (font) => {
        setSelectedFont(font);
        toast.info('Font customization - Coming soon');
    };

    const handleTemplateChange = (template) => {
        setSelectedTemplate(template);
        toast.info('Template selection - Coming soon');
    };

    return (
        <div className="space-y-6">
            {/* App Color */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">App Color</CardTitle>
                    <p className="text-sm text-slate-500">Choose your preferred accent color</p>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                        {colors.map((color) => (
                            <button
                                key={color.value}
                                onClick={() => handleColorChange(color.value)}
                                className="group relative"
                            >
                                <div
                                    className={`w-full aspect-square rounded-lg transition-all ${selectedColor === color.value
                                            ? 'ring-2 ring-offset-2 ring-slate-900 scale-105'
                                            : 'hover:scale-105'
                                        }`}
                                    style={{ backgroundColor: color.value }}
                                >
                                    {selectedColor === color.value && (
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <Check className="w-6 h-6 text-white drop-shadow-lg" />
                                        </div>
                                    )}
                                </div>
                                <p className="text-xs text-center mt-2 text-slate-600">{color.label}</p>
                            </button>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Font Style */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Font Style</CardTitle>
                    <p className="text-sm text-slate-500">Select your preferred font family</p>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        {fonts.map((font) => (
                            <button
                                key={font.value}
                                onClick={() => handleFontChange(font.value)}
                                className={`w-full text-left p-4 rounded-lg border-2 transition-all ${selectedFont === font.value
                                        ? 'border-slate-900 bg-slate-50'
                                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                                    }`}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                        <p className="font-semibold text-sm text-slate-900">{font.label}</p>
                                        <p className="text-sm text-slate-500 mt-1" style={{ fontFamily: font.value }}>
                                            {font.preview}
                                        </p>
                                    </div>
                                    {selectedFont === font.value && (
                                        <Check className="w-5 h-5 text-slate-900 ml-3" />
                                    )}
                                </div>
                            </button>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Template */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Template</CardTitle>
                    <p className="text-sm text-slate-500">Choose your interface theme</p>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {templates.map((template) => (
                            <button
                                key={template.value}
                                onClick={() => handleTemplateChange(template.value)}
                                className={`p-4 rounded-lg border-2 transition-all text-left ${selectedTemplate === template.value
                                        ? 'border-slate-900 bg-slate-50'
                                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                                    }`}
                            >
                                <div className="flex items-start justify-between mb-2">
                                    <div
                                        className={`w-12 h-12 rounded-lg flex items-center justify-center ${template.value === 'light' ? 'bg-white border-2 border-slate-200' :
                                                template.value === 'dark' ? 'bg-slate-900' :
                                                    'bg-gradient-to-br from-white to-slate-900'
                                            }`}
                                    >
                                        {template.value === 'light' && <div className="w-6 h-6 rounded bg-slate-100" />}
                                        {template.value === 'dark' && <div className="w-6 h-6 rounded bg-slate-700" />}
                                        {template.value === 'auto' && <div className="w-6 h-6 rounded bg-gradient-to-br from-slate-100 to-slate-700" />}
                                    </div>
                                    {selectedTemplate === template.value && (
                                        <Check className="w-5 h-5 text-slate-900" />
                                    )}
                                </div>
                                <p className="font-semibold text-sm text-slate-900">{template.label}</p>
                                <p className="text-xs text-slate-500 mt-1">{template.description}</p>
                            </button>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
