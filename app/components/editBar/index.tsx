"use client";
import React from 'react';
import Image from 'next/image';
import {
    AlignCenter,
    AlignLeft,
    AlignRight,
    Bold,
    Italic,
    Underline,
    Strikethrough,
    TextColor,
    H1,
    H2,
    IndentLeft,
    IndentRight,
    LineHeight,
    List,
    UndoArrow
} from './icons';
import { useState, useEffect } from 'react';
import { Colorful } from '@uiw/react-color';


export default function EditBar() {
    const [formatState, setFormatState] = useState({
        bold: false,
        italic: false,
        underline: false,
        strikethrough: false,
        h1: false,
        h2: false,
        alignment: 'left'
    });

    const [hasSelection, setHasSelection] = useState(false);
    const [showColorPicker, setShowColorPicker] = useState(false);
    const [pickerColor, setPickerColor] = useState('#000000');
    const [lineHeight, setLineHeight] = useState("1.5");
    const [fontSize, setFontSize] = useState("16");
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

    const execCommand = (command: string, value: string | undefined = undefined) => {
        document.execCommand(command, false, value);
    };

    const handleFormat = (id: string, value?: string) => {
        const selection = window.getSelection();
        if (!selection || !selection.rangeCount) return;
        
        switch(id) {
            case 'h1':
            case 'h2': {
                const range = selection.getRangeAt(0);
                const selectedText = range.toString();
                
                if (selectedText) {
                    const newHtml = `<${id}>${selectedText}</${id}>`;
                    document.execCommand('delete');
                    document.execCommand('insertHTML', false, newHtml);
                }
                break;
            }
            case 'bold':
                execCommand('bold');
                break;
            case 'italic':
                execCommand('italic');
                break;
            case 'underline':
                execCommand('underline');
                break;
            case 'strikethrough':
                execCommand('strikeThrough');
                break;
            case 'align-left': {
                const currentAlignment = formatState.alignment;
                let newAlignment;
                switch(currentAlignment) {
                    case 'left':
                        newAlignment = 'center';
                        execCommand('justifyCenter');
                        break;
                    case 'center':
                        newAlignment = 'right';
                        execCommand('justifyRight');
                        break;
                    case 'right':
                    default:
                        newAlignment = 'left';
                        execCommand('justifyLeft');
                        break;
                }
                setFormatState(prev => ({ ...prev, alignment: newAlignment }));
                break;
            }
            case 'list':
                execCommand('insertUnorderedList');
                setFormatState(prev => ({ ...prev, list: document.queryCommandState('insertUnorderedList') }));
                break;
            case 'indent-right':
                execCommand('indent');
                break;
            case 'indent-left':
                execCommand('outdent');
                break;
            case 'text-color': {
                if (value) {
                    const selection = window.getSelection();
                    const range = selection?.getRangeAt(0);
                    execCommand('foreColor', value);
                    if (range) {
                        selection?.removeAllRanges();
                        selection?.addRange(range);
                    }
                }
                break;
            }
            case 'line-height': {
                if (value) {
                    const range = selection.getRangeAt(0);
                    const container = range.commonAncestorContainer;
                    
                    if (container.nodeType === 3) {
                        const parentElement = container.parentElement;
                        if (parentElement) {
                            parentElement.style.lineHeight = value;
                        }
                    } 
                    else {
                        const elements = Array.from(container.childNodes);
                        elements.forEach(node => {
                            if (node.nodeType === 3 && node.parentElement) {
                                node.parentElement.style.lineHeight = value;
                            } else if (node.nodeType === 1) {
                                (node as HTMLElement).style.lineHeight = value;
                            }
                        });
                    }
                }
                break;
            }
            case 'font-family': {
                if (value) {
                    const selection = window.getSelection();
                    if (selection && selection.rangeCount > 0) {
                        const range = selection.getRangeAt(0);
                        const fragment = range.extractContents();
                        const span = document.createElement('span');
                        span.style.fontFamily = value;
                        
                        const applyFontToContent = (node: Node) => {
                            if (node.nodeType === 3) {
                                const span = document.createElement('span');
                                span.style.fontFamily = value;
                                span.textContent = node.textContent;
                                return span;
                            }
                            
                            if (node.nodeType === 1) {
                                const element = node as HTMLElement;
                                element.style.fontFamily = value;
                                Array.from(element.childNodes).forEach(child => {
                                    applyFontToContent(child);
                                });
                            }
                            return node;
                        };

                        Array.from(fragment.childNodes).forEach(node => {
                            span.appendChild(applyFontToContent(node));
                        });
                        
                        range.insertNode(span);
                        
                        const newRange = document.createRange();
                        newRange.selectNodeContents(span);
                        selection.removeAllRanges();
                        selection.addRange(newRange);
                    }
                }
                break;
            }
            case 'font-size': {
                if (value) {
                    const selection = window.getSelection();
                    if (selection && selection.rangeCount > 0) {
                        const range = selection.getRangeAt(0);
                        const fragment = range.extractContents();
                        const span = document.createElement('span');
                        span.style.fontSize = value;
                        
                        const applyFontSizeToContent = (node: Node) => {
                            if (node.nodeType === 3) {
                                const span = document.createElement('span');
                                span.style.fontSize = value;
                                span.textContent = node.textContent;
                                return span;
                            }
                            
                            if (node.nodeType === 1) {
                                const element = node as HTMLElement;
                                element.style.fontSize = value;
                                Array.from(element.childNodes).forEach(child => {
                                    applyFontSizeToContent(child);
                                });
                            }
                            return node;
                        };

                        Array.from(fragment.childNodes).forEach(node => {
                            span.appendChild(applyFontSizeToContent(node));
                        });
                        
                        range.insertNode(span);
                        
                        const newRange = document.createRange();
                        newRange.selectNodeContents(span);
                        selection.removeAllRanges();
                        selection.addRange(newRange);
                    }
                }
                break;
            }
        }
    };

    const checkFormatting = () => {
        const selection = window.getSelection();
        if (!selection || !selection.rangeCount) {
            setHasSelection(false);
            return;
        }

        const hasText = !selection.isCollapsed;
        setHasSelection(hasText);

        const range = selection.getRangeAt(0);
        const parentElement = range.commonAncestorContainer.nodeType === 3
            ? range.commonAncestorContainer.parentElement
            : range.commonAncestorContainer as HTMLElement;
        
        if (parentElement) {
            try {
                const computedStyle = window.getComputedStyle(parentElement);
                setFormatState({
                    h1: parentElement.tagName === 'H1',
                    h2: parentElement.tagName === 'H2',
                    bold: window.getSelection()?.toString() && document.queryCommandState('bold'),
                    italic: window.getSelection()?.toString() && document.queryCommandState('italic'),
                    underline: window.getSelection()?.toString() && document.queryCommandState('underline'),
                    strikethrough: window.getSelection()?.toString() && document.queryCommandState('strikethrough'),
                    alignment: computedStyle.textAlign || 'left'
                });
            } catch (e) {
                setFormatState({
                    h1: parentElement.tagName === 'H1',
                    h2: parentElement.tagName === 'H2',
                    bold: false,
                    italic: false,
                    underline: false,
                    strikethrough: false,
                    alignment: 'left'
                });
            }

            const computedStyle = window.getComputedStyle(parentElement);
            const currentLineHeight = computedStyle.lineHeight;
            const lineHeightValue = currentLineHeight !== 'normal' 
                ? parseFloat(currentLineHeight) / parseFloat(computedStyle.fontSize)
                : 1.5;
            setLineHeight(lineHeightValue.toFixed(1));

            let currentFontSize = parentElement.style.fontSize;
            if (!currentFontSize) {
                currentFontSize = computedStyle.fontSize;
            }
            if (currentFontSize) {
                const fontSizeValue = parseInt(currentFontSize);
                if (!isNaN(fontSizeValue)) {
                    setFontSize(fontSizeValue.toString());
                }
            }
        }
    };

    useEffect(() => {
        document.addEventListener('selectionchange', checkFormatting);
        return () => {
            document.removeEventListener('selectionchange', checkFormatting);
        };
    }, []);

    useEffect(() => {
        if (showColorPicker) {
            const handleClickOutside = (e: MouseEvent) => {
                const target = e.target as HTMLElement;
                if (!target.closest('.color-picker-container') && !target.closest('.editor-content')) {
                    setShowColorPicker(false);
                }
            };
            
            document.addEventListener('mousedown', handleClickOutside);
            return () => {
                document.removeEventListener('mousedown', handleClickOutside);
            };
        }
    }, [showColorPicker]);

    const handleUndo = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        document.execCommand('undo');
    };

    const getIcons = () => [
        {
            id: 'undo',
            icon: UndoArrow,
            name: 'Revenir en arrière',
            customRender: (item: any) => (
                <button
                    className="p-2 hover:bg-gray-100 rounded-lg"
                    title={item.name}
                    onMouseDown={handleUndo}
                    type="button"
                >
                    <Image 
                        src={item.icon}
                        alt={item.name}
                        width={20}
                        height={20}
                        className="w-[24px] h-[24px]"
                        draggable={false}
                    />
                </button>
            )
        },
        {
            id: 'h1',
            icon: H1,
            name: 'H1'
        },
        {
            id: 'h2',
            icon: H2,
            name: 'H2'
        },
        {
            id: 'font-family',
            name: 'Police d\'écriture',
            customRender: (item: any) => (
                <div className="relative">
                    <button
                        className={`p-2 rounded-lg 
                            ${hasSelection ? 'hover:bg-gray-100' : 'cursor-not-allowed'} 
                            ${activeDropdown === 'font-family' ? 'bg-gray-200' : ''} 
                            ${!hasSelection ? 'opacity-50' : ''}`}
                        title={item.name}
                        onMouseDown={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            if (!hasSelection) return;
                            setActiveDropdown(activeDropdown === 'font-family' ? null : 'font-family');
                        }}
                        type="button"
                    >
                        Aa
                    </button>
                    {activeDropdown === 'font-family' && hasSelection && (
                        <div 
                            className="absolute w-[200px] top-[45px] left-1/2 -translate-x-1/2 z-50 mt-1 bg-white border border-black rounded-lg overflow-hidden"
                            onMouseDown={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                            }}
                        >
                            <button 
                                className="w-full px-4 py-2 text-left hover:bg-gray-100 font-['Arial']"
                                onMouseDown={() => {
                                    handleFormat('font-family', 'Arial');
                                    setActiveDropdown(null);
                                }}
                            >
                                Arial
                            </button>
                            <button 
                                className="w-full px-4 py-2 text-left hover:bg-gray-100 font-['Times_New_Roman']"
                                onMouseDown={() => {
                                    handleFormat('font-family', 'Times New Roman');
                                    setActiveDropdown(null);
                                }}
                            >
                                Times New Roman
                            </button>
                            <button 
                                className="w-full px-4 py-2 text-left hover:bg-gray-100 font-['Courier_New']"
                                onMouseDown={() => {
                                    handleFormat('font-family', 'Courier New');
                                    setActiveDropdown(null);
                                }}
                            >
                                Courier New
                            </button>
                        </div>
                    )}
                </div>
            )
        },
        {
            id: 'font-size',
            name: 'Taille de police',
            customRender: (item: any) => (
                <div className="relative">
                    <button
                        className={`p-2 rounded-lg 
                            ${hasSelection ? 'hover:bg-gray-100' : 'cursor-not-allowed'} 
                            ${activeDropdown === 'font-size' ? 'bg-gray-200' : ''} 
                            ${!hasSelection ? 'opacity-50' : ''}`}
                        title={item.name}
                        onMouseDown={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            if (!hasSelection) return;
                            setActiveDropdown(activeDropdown === 'font-size' ? null : 'font-size');
                        }}
                        type="button"
                    >
                        {fontSize}px
                    </button>
                    {activeDropdown === 'font-size' && hasSelection && (
                        <div 
                            className="absolute top-[45px] left-1/2 -translate-x-1/2 z-50 mt-1"
                            onMouseDown={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                            }}
                        >
                            <div className="flex items-center text-sm bg-white border border-black rounded-lg overflow-hidden">
                                <button
                                    className="px-2 py-1 hover:bg-gray-100"
                                    onMouseDown={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        const newValue = (parseInt(fontSize) - 1).toString();
                                        if (parseInt(newValue) >= 8) {
                                            setFontSize(newValue);
                                            handleFormat('font-size', `${newValue}px`);
                                        }
                                    }}
                                >
                                    -
                                </button>
                                <input
                                    type="number"
                                    value={fontSize}
                                    min="8"
                                    max="72"
                                    className="w-16 px-2 py-1 text-center focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                    onChange={(e) => {
                                        const newValue = e.target.value;
                                        if (parseInt(newValue) >= 8 && parseInt(newValue) <= 72) {
                                            setFontSize(newValue);
                                            handleFormat('font-size', `${newValue}px`);
                                        }
                                    }}
                                />
                                <button
                                    className="px-2 py-1 hover:bg-gray-100"
                                    onMouseDown={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        const newValue = (parseInt(fontSize) + 1).toString();
                                        if (parseInt(newValue) <= 72) {
                                            setFontSize(newValue);
                                            handleFormat('font-size', `${newValue}px`);
                                        }
                                    }}
                                >
                                    +
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )
        },
        {
            id: 'text-color',
            icon: TextColor,
            name: 'Couleur de texte',
            customRender: (item: any) => (
                <div className="relative">
                    <button
                        className={`p-2 hover:bg-gray-100 rounded-lg ${activeDropdown === 'text-color' ? 'bg-gray-200' : ''} 
                            ${item.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                        title={item.name}
                        onMouseDown={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setActiveDropdown(activeDropdown === 'text-color' ? null : 'text-color');
                        }}
                        type="button"
                    >
                        <Image 
                            src={item.icon}
                            alt={item.name}
                            width={20}
                            height={20}
                            className="w-[24px] h-[24px] cursor-pointer"
                            draggable={false}
                        />
                    </button>
                    {activeDropdown === 'text-color' && (
                        <div 
                            className="absolute top-full left-1/2 -translate-x-1/2 z-50"
                            onMouseDown={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                            }}
                        >
                            <Colorful
                                style={{ marginTop: 5, width: '150px', height: '80px' }}
                                color={pickerColor}
                                onChange={(color) => {
                                    setPickerColor(color.hex);
                                    if (hasSelection) {
                                        handleFormat('text-color', color.hex);
                                    }
                                }}
                                disableAlpha={true}
                            />
                        </div>
                    )}
                </div>
            )
        },
        {
            id: 'bold',
            icon: Bold,
            name: 'Gras'
        },
        {
            id: 'italic',
            icon: Italic,
            name: 'Italique'
        },
        {
            id: 'underline',
            icon: Underline,
            name: 'Souligné'
        },
        {
            id: 'strikethrough',
            icon: Strikethrough,
            name: 'Barré'
        },
        {
            id: 'align-left',
            icon: formatState.alignment === 'left' ? AlignLeft :
                  formatState.alignment === 'center' ? AlignCenter : AlignRight,
            name: `Aligner`
        },
        {
            id: 'list',
            icon: List,
            name: 'Liste'
        },
        {
            id: 'line-height',
            icon: LineHeight,
            name: 'Hauteur de ligne',
            customRender: (item: any) => (
                <div className="relative">
                    <button
                        className={`p-2 rounded-lg 
                            ${hasSelection ? 'hover:bg-gray-100' : 'cursor-not-allowed'} 
                            ${activeDropdown === 'line-height' ? 'bg-gray-200' : ''} 
                            ${!hasSelection ? 'opacity-50' : ''}`}
                        title={item.name}
                        onMouseDown={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            if (!hasSelection) return;
                            setActiveDropdown(activeDropdown === 'line-height' ? null : 'line-height');
                        }}
                        type="button"
                    >
                        <Image 
                            src={item.icon}
                            alt={item.name}
                            width={20}
                            height={20}
                            className="w-[24px] h-[24px]"
                            draggable={false}
                        />
                    </button>
                    {activeDropdown === 'line-height' && hasSelection && (
                        <div 
                            className="absolute top-[45px] left-1/2 -translate-x-1/2 z-50 mt-1"
                            onMouseDown={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                            }}
                        >
                            <div className="flex items-center bg-white border border-black rounded-lg overflow-hidden">
                                <button
                                    className="px-2 py-1 hover:bg-gray-100"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        const newValue = (parseFloat(lineHeight) - 0.1).toFixed(1);
                                        if (parseFloat(newValue) >= 1) {
                                            setLineHeight(newValue);
                                            handleFormat('line-height', newValue);
                                        }
                                    }}
                                >
                                    -
                                </button>
                                <input
                                    type="number"
                                    value={lineHeight}
                                    min="1"
                                    max="3"
                                    step="0.1"
                                    className="w-16 px-2 py-1 text-center text-sm focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                    onChange={(e) => {
                                        const newValue = e.target.value;
                                        if (parseFloat(newValue) >= 1 && parseFloat(newValue) <= 3) {
                                            setLineHeight(newValue);
                                            handleFormat('line-height', newValue);
                                        }
                                    }}
                                />
                                <button
                                    className="px-2 py-1 hover:bg-gray-100"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        const newValue = (parseFloat(lineHeight) + 0.1).toFixed(1);
                                        if (parseFloat(newValue) <= 3) {
                                            setLineHeight(newValue);
                                            handleFormat('line-height', newValue);
                                        }
                                    }}
                                >
                                    +
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )
        },
        {
            id: 'indent-right',
            icon: IndentRight,
            name: 'Augmenter le retrait'
        },
        {
            id: 'indent-left',
            icon: IndentLeft,
            name: 'Diminuer le retrait'
        }
    ];

    return (
        <div className="flex gap-4 min-w-[800px] p-2 fixed top-[32px] left-[calc(50%_+_var(--sidebar-width)/2)] -translate-x-[50%] bg-white rounded-[16px] border border-primary shadow z-50">
            {getIcons().map((item) => (
                item.customRender ? 
                    <React.Fragment key={item.id}>
                        {item.customRender(item)}
                    </React.Fragment>
                    :
                    <button
                        key={item.id}
                        className={`p-2 hover:bg-gray-100 rounded-lg 
                            ${formatState[item.id as keyof typeof formatState] ? 'bg-gray-200' : ''}
                            ${!hasSelection ? 'opacity-50' : ''}`}
                        title={item.name}
                        onMouseDown={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            if (!hasSelection) return;
                            handleFormat(item.id);
                        }}
                        type="button"
                    >
                        <Image 
                            src={item.icon}
                            alt={item.name}
                            width={20}
                            height={20}
                            className="w-[24px] h-[24px]"
                            draggable={false}
                        />
                    </button>
            ))}
        </div>
    );
}
  