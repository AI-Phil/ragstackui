'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

export default function Menu() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const menuItems = [
    { href: "/", text: "Home" },
    { href: "/test-setup", text: "Test Setup" }
  ];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (isOpen && menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const closeMenu = () => setIsOpen(false);

  const renderMenuItems = () => menuItems.map((item) => (
    <Link key={item.href} href={item.href} className="block md:inline-block p-2" onClick={closeMenu}>
      {item.text}
    </Link>
  ));

  return (
    <div ref={menuRef} className="flex justify-between items-center p-4 md:p-8">
      {/* Title always visible */}
      <Link href="/" className="font-bold" onClick={closeMenu}>
        RAGStack Demo
      </Link>

      {/* Menu Icon for smaller screens */}
      <button
        className="material-icons p-4 md:hidden menu-icon-hidden-md"
        onClick={() => setIsOpen(!isOpen)}
      >
        menu
      </button>

      {/* Overlay Menu for smaller screens */}
      <div className={`absolute top-0 left-0 w-full bg-white md:hidden ${isOpen ? 'block' : 'hidden'}`}>
        {renderMenuItems()}
      </div>

      {/* Horizontal Menu for larger screens, centered */}
      <div className="hidden md:flex flex-grow items-center justify-center">
        {renderMenuItems()}
      </div>

      {/* Placeholder to balance the space on the right, keeping title on the left */}
      <div className="hidden md:block w-16 md:w-24 lg:w-32"></div>
    </div>
  );
}
