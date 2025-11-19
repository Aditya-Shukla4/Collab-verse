import Link from "next/link";
import Image from "next/image";

const LandingFooter = () => (
  <footer
    id="contact"
    className="bg-gradient-to-b from-black to-purple-950/100 text-gray-300 py-10 px-6 md:px-16"
  >
    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 text-sm">
      <div>
        <h2 className="font-bold text-white mb-4 text-lg">Collab Verse</h2>
        <p className="leading-relaxed">
          A one-stop hub for finding partner developers, creating and
          contributing to projects and growing together.
        </p>
      </div>

      <div>
        <h3 className="font-semibold text-white mb-3">Quick Links</h3>
        <ul className="space-y-2">
          <li>
            <Link href="/" className="hover:text-white">
              Home
            </Link>
          </li>
          <li>
            <Link href="/#features" className="hover:text-white">
              Features
            </Link>
          </li>
          <li>
            <Link href="/about" className="hover:text-white">
              About
            </Link>
          </li>
          <li>
            <Link href="/contact" className="hover:text-white">
              Contact
            </Link>
          </li>
        </ul>
      </div>

      <div>
        <h3 className="font-semibold text-white mb-3">Resources</h3>
        <ul className="space-y-2">
          <li>
            <a href="#" className="hover:text-white">
              FAQ
            </a>
          </li>
          <li>
            <a href="#" className="hover:text-white">
              Privacy Policy
            </a>
          </li>
          <li>
            <a href="#" className="hover:text-white">
              Terms of Service
            </a>
          </li>
          <li>
            <a href="#" className="hover:text-white">
              Support
            </a>
          </li>
        </ul>
      </div>

      <div>
        <h3 className="font-semibold text-white mb-3">Follow Us</h3>
        <div className="flex flex-col space-y-2">
          <a
            href="https://github.com/Aditya-Shukla4/Collab-verse"
            className="hover:text-white flex items-center gap-2"
          >
            <Image
              src="https://cdn-icons-png.flaticon.com/512/3291/3291695.png"
              alt="GitHub"
              width={24}
              height={24}
              className="bg-white rounded-full"
            />
            <span>Github</span>
          </a>
          <a href="#" className="hover:text-white flex items-center gap-2">
            <Image
              src="https://cdn-icons-png.flaticon.com/512/10110/10110392.png"
              alt="LinkedIn"
              width={24}
              height={24}
              className="bg-white rounded-lg"
            />
            <span>LinkedIn</span>
          </a>
        </div>
      </div>
    </div>

    <div className="border-t border-gray-700 mt-10 pt-6 text-center text-sm text-gray-400">
      © 2025 Collab Verse. All rights reserved.
    </div>
  </footer>
);

export default LandingFooter;
