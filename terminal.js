// 终端命令系统
class Terminal {
    constructor() {
        this.output = document.getElementById('terminalOutput');
        this.input = document.getElementById('terminalInput');
        this.commandHistory = [];
        this.historyIndex = -1;
        this.currentCommand = '';
        
        // 可用命令列表
        this.commands = [
            'about', 'awards', 'banner', 'cat', 'cd', 'clear', 'contact',
            'date', 'echo', 'education', 'fuck', 'help', 'history', 'hobbies',
            'languages', 'ls', 'neofetch', 'ping', 'projects', 'publications',
            'pwd', 'quote', 'reboot', 'shit', 'skills', 'sudo', 'talks',
            'theme', 'time', 'tree', 'weather', 'whoami', 'wtf'
        ];
        
        this.init();
    }
    
    init() {
        // 检查元素是否存在
        if (!this.input || !this.output) {
            console.error('Terminal elements not found!', {
                input: this.input,
                output: this.output
            });
            // 延迟重试
            setTimeout(() => this.init(), 100);
            return;
        }
        
        // 先显示开机动画
        this.showBootAnimation(() => {
            // 动画完成后绑定事件
            this.setupEventListeners();
        });
    }
    
    setupEventListeners() {
        // 绑定输入事件 - 使用箭头函数确保 this 正确绑定
        const handleKeyDown = (e) => {
            this.handleKeyDown(e);
        };
        
        this.input.addEventListener('keydown', handleKeyDown, true);
        this.input.addEventListener('input', () => this.handleInput());
        
        // 确保输入框始终获得焦点
        setTimeout(() => {
            this.input.focus();
        }, 50);
        
        // 点击终端区域时聚焦输入框
        const terminalBody = document.getElementById('terminalBody');
        if (terminalBody) {
            terminalBody.addEventListener('click', () => {
                this.input.focus();
            });
        }
        
        // 初始滚动到底部
        setTimeout(() => {
            this.scrollToBottom();
        }, 100);
    }
    
    showBootAnimation(callback) {
        // 清空输出
        this.output.innerHTML = '';
        
        // ASCII艺术 - LOUAQ
        const asciiArt = [
            ' _       ____  _    _  ___   ___  ',
            '| |     / __ \\| |  | |/ _ \\ / _ \\ ',
            '| |    | |  | | |  | | |_| | | | |',
            '| |    | |  | | |  | |  _  | | | |',
            '| |____| |__| | |__| | | | | |_| |',
            '|______|\\____/ \\____/|_| |_|\\__\\_\\',
            '',
            'YangYang Terminal v1.0.0',
            ''
        ];
        
        // 启动信息
        const bootMessages = [
            '[OK] Initializing terminal system...',
            '[OK] Loading command modules...',
            '[OK] Setting up event handlers...',
            '[OK] Terminal ready!',
            '',
            'Welcome to my page. Type \'help\' to list commands. 你好, 欢迎光临~~',
            ''
        ];
        
        let lineIndex = 0;
        const totalLines = asciiArt.length + bootMessages.length;
        
        // 逐行显示ASCII艺术
        const showAsciiLine = () => {
            if (lineIndex < asciiArt.length) {
                const line = asciiArt[lineIndex];
                if (line) {
                    this.printLine(line, 'ascii-art');
                } else {
                    this.printLine('', 'text');
                }
                lineIndex++;
                setTimeout(showAsciiLine, 80); // 每行延迟80ms
            } else {
                // ASCII艺术显示完成，显示启动信息
                showBootMessages();
            }
        };
        
        // 逐行显示启动信息
        const showBootMessages = () => {
            if (lineIndex < totalLines) {
                const msgIndex = lineIndex - asciiArt.length;
                const message = bootMessages[msgIndex];
                
                if (message.startsWith('[OK]')) {
                    this.printLine(message, 'success');
                } else if (message) {
                    this.printLine(message, 'text');
                } else {
                    this.printLine('', 'text');
                }
                
                lineIndex++;
                setTimeout(showBootMessages, 150); // 每行延迟150ms
            } else {
                // 动画完成，执行回调
                if (callback) {
                    callback();
                }
            }
        };
        
        // 开始显示动画
        showAsciiLine();
    }
    
    handleKeyDown(e) {
        // Enter 键执行命令
        if (e.key === 'Enter' || e.keyCode === 13) {
            e.preventDefault();
            e.stopPropagation();
            const command = this.input ? this.input.value : '';
            // 无论命令是否为空，都执行命令（空命令会显示新的提示符）
            this.executeCommand(command);
            return false;
        }
        // 上箭头键浏览历史
        else if (e.key === 'ArrowUp' || e.keyCode === 38) {
            e.preventDefault();
            this.navigateHistory('up');
            return false;
        }
        // 下箭头键浏览历史
        else if (e.key === 'ArrowDown' || e.keyCode === 40) {
            e.preventDefault();
            this.navigateHistory('down');
            return false;
        }
        // Tab 键自动完成
        else if (e.key === 'Tab' || e.keyCode === 9) {
            e.preventDefault();
            this.autoComplete();
            return false;
        }
    }
    
    handleInput() {
        // 可以在这里实现实时搜索等功能
    }
    
    navigateHistory(direction) {
        if (this.commandHistory.length === 0) return;
        
        if (direction === 'up') {
            if (this.historyIndex === -1) {
                this.currentCommand = this.input.value;
            }
            if (this.historyIndex < this.commandHistory.length - 1) {
                this.historyIndex++;
                this.input.value = this.commandHistory[this.commandHistory.length - 1 - this.historyIndex];
            }
        } else if (direction === 'down') {
            if (this.historyIndex > 0) {
                this.historyIndex--;
                this.input.value = this.commandHistory[this.commandHistory.length - 1 - this.historyIndex];
            } else if (this.historyIndex === 0) {
                this.historyIndex = -1;
                this.input.value = this.currentCommand;
            }
        }
    }
    
    autoComplete() {
        const input = this.input.value.trim();
        if (!input) {
            this.showCommandList();
            return;
        }
        
        const matches = this.commands.filter(cmd => cmd.startsWith(input));
        if (matches.length === 1) {
            this.input.value = matches[0];
        } else if (matches.length > 1) {
            this.printLine(`Did you mean: ${matches.join(', ')}?`, 'info');
        }
    }
    
    executeCommand(command) {
        const trimmedCommand = command ? command.trim() : '';

        // 显示命令提示符（无论是否为空）
        this.printPrompt(trimmedCommand);

        if (!trimmedCommand) {
            // 空命令时只显示提示符，不执行任何操作
            this.addInputLine();
            this.scrollToBottom();
            return;
        }

        // 保存命令到历史
        if (this.commandHistory.length === 0 || trimmedCommand !== this.commandHistory[this.commandHistory.length - 1]) {
            this.commandHistory.push(trimmedCommand);
        }
        this.historyIndex = -1;
        this.currentCommand = '';
        
        // 执行命令
        const [cmd, ...args] = trimmedCommand.split(' ');
        
        switch (cmd.toLowerCase()) {
            case 'help':
                this.showHelp();
                break;
            case 'ls':
                this.showCommandList();
                break;
            case 'clear':
            case 'cls':
                this.clearTerminal();
                break;
            case 'about':
                this.showAbout();
                break;
            case 'contact':
                this.showContact();
                break;
            case 'projects':
                this.showProjects();
                break;
            case 'publications':
                this.showPublications();
                break;
            case 'talks':
                this.showTalks();
                break;
            case 'awards':
                this.showAwards();
                break;
            case 'education':
                this.showEducation();
                break;
            case 'languages':
                this.showLanguages();
                break;
            case 'hobbies':
                this.showHobbies();
                break;
            case 'whoami':
                this.showWhoami();
                break;
            case 'theme':
                this.toggleTheme();
                break;
            case 'reboot':
            case 'reload':
                this.reboot();
                break;
            case 'banner':
                this.showBanner();
                break;
            case 'echo':
                this.showEcho(args.join(' '));
                break;
            case 'date':
                this.showDate();
                break;
            case 'time':
                this.showTime();
                break;
            case 'history':
                this.showHistory();
                break;
            case 'pwd':
                this.showPwd();
                break;
            case 'cd':
                this.changeDirectory(args[0]);
                break;
            case 'cat':
                this.showCat(args[0]);
                break;
            case 'neofetch':
                this.showNeofetch();
                break;
            case 'tree':
                this.showTree();
                break;
            case 'skills':
                this.showSkills();
                break;
            case 'quote':
                this.showQuote();
                break;
            case 'weather':
                this.showWeather();
                break;
            case 'sudo':
                this.showSudo(args.join(' '));
                break;
            case 'ping':
                this.showPing(args[0]);
                break;
            case 'fuck':
            case 'wtf':
            case 'shit':
                this.showFuck();
                break;
            default:
                this.printLine(`Unknown command: ${cmd} (type 'help')`, 'error');
        }
        
        this.addInputLine();
        this.scrollToBottom();
    }
    
    addInputLine() {
        // 清空输入框并重新聚焦
        this.input.value = '';
        this.input.focus();
    }
    
    printLine(text, type = 'text') {
        const line = document.createElement('div');
        line.className = 'terminal-line';
        
        const span = document.createElement('span');
        span.className = `terminal-${type}`;
        span.textContent = text;
        
        line.appendChild(span);
        this.output.appendChild(line);
    }
    
    printPrompt(commandText = '') {
        const line = document.createElement('div');
        line.className = 'terminal-line';

        const prompt = document.createElement('span');
        prompt.className = 'terminal-prompt-text';
        prompt.textContent = 'visitor>';

        line.appendChild(prompt);

        if (commandText) {
            const text = document.createElement('span');
            text.className = 'terminal-command-text';
            text.textContent = ` ${commandText}`;
            line.appendChild(text);
        }

        this.output.appendChild(line);
    }
    
    showHelp() {
        this.printLine('Available commands:', 'info');
        this.printLine('');
        const commands = [
            { cmd: 'help', desc: 'Show this help message' },
            { cmd: 'ls', desc: 'List all available commands' },
            { cmd: 'clear/cls', desc: 'Clear the terminal screen' },
            { cmd: 'about', desc: 'Show information about me' },
            { cmd: 'contact', desc: 'Show contact information' },
            { cmd: 'projects', desc: 'Show my projects' },
            { cmd: 'publications', desc: 'Show my publications' },
            { cmd: 'talks', desc: 'Show my talks and presentations' },
            { cmd: 'awards', desc: 'Show my awards' },
            { cmd: 'education', desc: 'Show my education background' },
            { cmd: 'languages', desc: 'Show programming languages I know' },
            { cmd: 'skills', desc: 'Show my technical skills' },
            { cmd: 'hobbies', desc: 'Show my hobbies' },
            { cmd: 'whoami', desc: 'Display user information' },
            { cmd: 'banner', desc: 'Display the welcome banner' },
            { cmd: 'neofetch', desc: 'Display system information' },
            { cmd: 'echo <text>', desc: 'Print text to terminal' },
            { cmd: 'date', desc: 'Display current date' },
            { cmd: 'time', desc: 'Display current time' },
            { cmd: 'history', desc: 'Show command history' },
            { cmd: 'pwd', desc: 'Print working directory' },
            { cmd: 'cd <dir>', desc: 'Change directory (simulated)' },
            { cmd: 'cat <file>', desc: 'Display file contents' },
            { cmd: 'tree', desc: 'Display directory tree' },
            { cmd: 'quote', desc: 'Display a random quote' },
            { cmd: 'weather', desc: 'Show weather information' },
            { cmd: 'ping <host>', desc: 'Ping a host (simulated)' },
            { cmd: 'sudo <cmd>', desc: 'Execute command as superuser' },
            { cmd: 'theme', desc: 'Toggle between light/dark theme' },
            { cmd: 'reboot/reload', desc: 'Reload the page' },
            { cmd: 'fuck/wtf/shit', desc: '🎮 Easter egg - Try it! (NSFW)' }
        ];

        commands.forEach(({ cmd, desc }) => {
            this.printLine(`  ${cmd.padEnd(18)} - ${desc}`, 'text');
        });

        this.printLine('', 'text');
        this.printLine('💡 Tips:', 'info');
        this.printLine('  • Use ↑/↓ arrows to navigate command history', 'text');
        this.printLine('  • Press Tab for auto-completion', 'text');
        this.printLine('  • Try the easter egg commands for fun! 😏', 'text');
    }
    
    showCommandList() {
        this.printLine('Available commands:', 'info');
        const list = document.createElement('div');
        list.className = 'command-list';
        
        this.commands.forEach(cmd => {
            const item = document.createElement('span');
            item.className = 'command-item';
            item.textContent = cmd;
            item.addEventListener('click', () => {
                this.input.value = cmd;
                this.input.focus();
            });
            list.appendChild(item);
        });
        
        const line = document.createElement('div');
        line.className = 'terminal-line';
        line.appendChild(list);
        this.output.appendChild(line);
    }
    
    clearTerminal() {
        this.output.innerHTML = '';
    }
    
    showAbout() {
        const aboutText = `I am a Computer Technology MS student at School of Computer Science 
(School of Artificial Intelligence), South-Central Minzu University, 
advised by Dr. Jianlin Zhu (朱剑林). 

My research lies in the interdisciplinary areas of artificial intelligence 
and medical image analysis, aiming at advancing healthcare with machine intelligence. 
My research focuses on Multimodal Medical Image Analysis and Computer Vision.

I am particularly interested in developing innovative deep learning methodologies 
for multimodal medical image analysis and healthcare technology applications.

I also received my B.S. degree in Network Engineering from South-Central Minzu University in 2024.

If you are interested in my academic research, please feel free to contact me at any time. 
I am eager to communicate with you. 🤗🤗`;
        
        const content = document.createElement('div');
        content.className = 'about-content';
        content.textContent = aboutText;
        
        const line = document.createElement('div');
        line.className = 'terminal-line';
        line.appendChild(content);
        this.output.appendChild(line);
    }
    
    showContact() {
        const contacts = [
            { icon: '📍', label: 'Location', value: 'Wuhan, China' },
            { icon: '📧', label: 'Email', value: 'yangyang@mail.scuec.edu.cn', link: 'mailto:yangyang@mail.scuec.edu.cn' },
            { icon: '🎓', label: 'Google Scholar', value: 'View Profile', link: 'https://scholar.google.com/citations?user=ph6q3aQAAAAJ' },
            { icon: '💻', label: 'GitHub', value: 'Louaq', link: 'https://github.com/Louaq' },
            { icon: '🔬', label: 'ResearchGate', value: 'Yang Yang', link: 'https://www.researchgate.net/profile/Yang-Yang-826' },
            { icon: '🆔', label: 'ORCID', value: '0009-0009-6670-7889', link: 'https://orcid.org/0009-0009-6670-7889' },
            { icon: '📄', label: 'OpenReview', value: 'View Profile', link: 'https://openreview.net/profile?id=~Yang_Yang133' }
        ];
        
        const content = document.createElement('div');
        content.className = 'contact-content';
        
        contacts.forEach(contact => {
            const item = document.createElement('div');
            item.className = 'contact-item';
            
            const icon = document.createElement('span');
            icon.textContent = contact.icon;
            icon.style.marginRight = '10px';
            
            const label = document.createElement('span');
            label.textContent = `${contact.label}: `;
            label.style.color = '#58a6ff';
            
            let value;
            if (contact.link) {
                value = document.createElement('a');
                value.href = contact.link;
                value.target = '_blank';
                value.textContent = contact.value;
                value.style.color = '#79c0ff';
            } else {
                value = document.createElement('span');
                value.textContent = contact.value;
                value.style.color = '#c9d1d9';
            }
            
            item.appendChild(icon);
            item.appendChild(label);
            item.appendChild(value);
            content.appendChild(item);
        });
        
        const line = document.createElement('div');
        line.className = 'terminal-line';
        line.appendChild(content);
        this.output.appendChild(line);
    }
    
    showProjects() {
        const projects = [
            {
                title: 'Rice Pest and Disease Detection System',
                description: 'An intelligent system for automated detection and classification of rice pests and diseases using deep learning techniques.',
                link: 'https://drive.google.com/file/d/1Six0T71DQEEsr7OH-iI0AiNGi1UrYrDh/view?usp=sharing',
                year: '2024'
            },
            {
                title: 'TexStudio: OCR mathematical formula recognition',
                description: 'A modern LaTeX formula recognition desktop application built with TypeScript and Electron.',
                link: 'https://github.com/Louaq/TexStudio/releases',
                year: '2025'
            }
        ];
        
        projects.forEach(project => {
            const item = document.createElement('div');
            item.className = 'project-item';
            
            const title = document.createElement('div');
            title.className = 'project-title';
            title.textContent = `[${project.year}] ${project.title}`;
            
            const desc = document.createElement('div');
            desc.className = 'project-description';
            desc.textContent = project.description;
            
            const link = document.createElement('a');
            link.className = 'project-link';
            link.href = project.link;
            link.target = '_blank';
            link.textContent = '[demo]';
            
            item.appendChild(title);
            item.appendChild(desc);
            item.appendChild(link);
            
            const line = document.createElement('div');
            line.className = 'terminal-line';
            line.appendChild(item);
            this.output.appendChild(line);
        });
    }
    
    showPublications() {
        const publications = [
            {
                title: 'HSFPN-Det: An Effective Model for Detecting Rice Pests and Diseases',
                authors: 'Yang Yang, Yuxin Hong, Wenjie Yu, Xiao Zhang, Bo Yang, Meng Shi, Yangguang Sun, Jun Wang, Jianlin Zhu*',
                venue: 'TVC 2025 (SCI-Q3, IF=2.9) - Accepted!',
                year: '2025'
            },
            {
                title: 'An Improved YOLOv8-Based Rice Pest and Disease Detection Method',
                authors: 'Yang Yang, Jianlin Zhu*, Bo Yang, Xiao Zhang, Jin Huang',
                venue: 'CGI 2024 (CCF C)',
                year: '2024'
            }
        ];
        
        publications.forEach(pub => {
            const item = document.createElement('div');
            item.className = 'publication-item';
            
            const title = document.createElement('div');
            title.className = 'publication-title';
            title.textContent = `[${pub.year}] ${pub.title}`;
            
            const authors = document.createElement('div');
            authors.className = 'publication-authors';
            authors.textContent = pub.authors;
            
            const venue = document.createElement('div');
            venue.className = 'publication-venue';
            venue.textContent = pub.venue;
            
            item.appendChild(title);
            item.appendChild(authors);
            item.appendChild(venue);
            
            const line = document.createElement('div');
            line.className = 'terminal-line';
            line.appendChild(item);
            this.output.appendChild(line);
        });
    }
    
    showTalks() {
        const talks = [
            {
                title: 'An Improved YOLOv8-Based Rice Pest and Disease Detection Method',
                venue: 'International Conference on Computer Graphics (CGI), 2024',
                description: 'Presented our novel approach for rice pest and disease detection using improved YOLOv8 architecture.'
            }
        ];
        
        talks.forEach(talk => {
            const item = document.createElement('div');
            item.className = 'talk-item';
            
            const title = document.createElement('div');
            title.className = 'talk-title';
            title.textContent = talk.title;
            
            const venue = document.createElement('div');
            venue.className = 'talk-venue';
            venue.textContent = talk.venue;
            
            const desc = document.createElement('div');
            desc.className = 'talk-venue';
            desc.textContent = talk.description;
            desc.style.marginTop = '5px';
            desc.style.color = '#8b949e';
            
            item.appendChild(title);
            item.appendChild(venue);
            item.appendChild(desc);
            
            const line = document.createElement('div');
            line.className = 'terminal-line';
            line.appendChild(item);
            this.output.appendChild(line);
        });
    }
    
    showAwards() {
        const awards = [
            '[09/2025] First-class Academic Scholarship for Graduate Students (TOP 1) 🥺🙃',
            '[09/2025] Outstanding Graduate Student 🙂🤓',
            '[09/2024] Second-class Academic Scholarship for Graduate Students 🙂🥳'
        ];
        
        awards.forEach(award => {
            const item = document.createElement('div');
            item.className = 'award-item';
            item.textContent = award;
            
            const line = document.createElement('div');
            line.className = 'terminal-line';
            line.appendChild(item);
            this.output.appendChild(line);
        });
    }
    
    showEducation() {
        const education = [
            {
                degree: 'M.S. in Computer Technology',
                school: 'School of Computer Science, South-Central Minzu University',
                location: 'Wuhan, China',
                period: 'Sep. 2024 - present'
            },
            {
                degree: 'B.S. in Network Engineering',
                school: 'School of Computer Science, South-Central Minzu University',
                location: 'Wuhan, China',
                period: 'Sep. 2020 - Jul. 2024'
            }
        ];
        
        education.forEach(edu => {
            const item = document.createElement('div');
            item.className = 'education-item';
            
            const degree = document.createElement('div');
            degree.className = 'education-degree';
            degree.textContent = edu.degree;
            
            const school = document.createElement('div');
            school.className = 'education-school';
            school.textContent = edu.school;
            
            const location = document.createElement('div');
            location.className = 'education-school';
            location.textContent = edu.location;
            location.style.color = '#8b949e';
            
            const period = document.createElement('div');
            period.className = 'education-period';
            period.textContent = edu.period;
            
            item.appendChild(degree);
            item.appendChild(school);
            item.appendChild(location);
            item.appendChild(period);
            
            const line = document.createElement('div');
            line.className = 'terminal-line';
            line.appendChild(item);
            this.output.appendChild(line);
        });
    }
    
    showLanguages() {
        const languages = [
            { name: 'Python', level: '★★★★★' },
            { name: 'JavaScript', level: '★★★★☆' },
            { name: 'TypeScript', level: '★★★★☆' },
            { name: 'C++', level: '★★★☆☆' },
            { name: 'Java', level: '★★★☆☆' },
            { name: 'MATLAB', level: '★★★☆☆' }
        ];
        
        const content = document.createElement('div');
        content.className = 'languages-content';
        
        languages.forEach(lang => {
            const item = document.createElement('div');
            item.className = 'language-item';
            
            const name = document.createElement('span');
            name.className = 'language-name';
            name.textContent = lang.name;
            
            const level = document.createElement('span');
            level.textContent = lang.level;
            level.style.color = '#3fb950';
            
            item.appendChild(name);
            item.appendChild(level);
            content.appendChild(item);
        });
        
        const line = document.createElement('div');
        line.className = 'terminal-line';
        line.appendChild(content);
        this.output.appendChild(line);
    }
    
    showHobbies() {
        const hobbies = `In my free time, I enjoy:
• Reading research papers and staying updated with the latest developments in AI
• Exploring new deep learning frameworks and tools
• Contributing to open-source projects
• Playing video games to relax
• Photography and traveling`;
        
        const content = document.createElement('div');
        content.className = 'hobbies-content';
        content.textContent = hobbies;
        
        const line = document.createElement('div');
        line.className = 'terminal-line';
        line.appendChild(content);
        this.output.appendChild(line);
    }
    
    showWhoami() {
        const info = `visitor
--------
Name: Yang Yang (杨杨)
Role: Computer Technology MS Student
Location: Wuhan, China
Research: Multimodal Medical Image Analysis & Computer Vision
Institution: South-Central Minzu University`;
        
        this.printLine(info, 'text');
    }
    
    toggleTheme() {
        // 这里可以实现主题切换功能
        this.printLine('Theme toggle feature coming soon!', 'info');
    }
    
    reboot() {
        this.printLine('Rebooting...', 'info');
        setTimeout(() => {
            location.reload();
        }, 500);
    }
    
    showBanner() {
        const banner = [
            ' _       ____  _    _  ___   ___  ',
            '| |     / __ \\| |  | |/ _ \\ / _ \\ ',
            '| |    | |  | | |  | | |_| | | | |',
            '| |    | |  | | |  | |  _  | | | |',
            '| |____| |__| | |__| | | | | |_| |',
            '|______|\\____/ \\____/|_| |_|\\__\\_\\',
            '',
            'YangYang Terminal v1.0.0',
            'Welcome to my page. Type \'help\' to list commands.'
        ];
        banner.forEach(line => {
            this.printLine(line, 'ascii-art');
        });
    }

    showEcho(text) {
        if (!text) {
            this.printLine('', 'text');
        } else {
            this.printLine(text, 'text');
        }
    }

    showDate() {
        const now = new Date();
        const dateStr = now.toLocaleDateString('zh-CN', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        this.printLine(dateStr, 'text');
    }

    showTime() {
        const now = new Date();
        const timeStr = now.toLocaleTimeString('zh-CN', {
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
        this.printLine(timeStr, 'text');
    }

    showHistory() {
        if (this.commandHistory.length === 0) {
            this.printLine('No command history.', 'info');
            return;
        }
        this.printLine('Command History:', 'info');
        this.commandHistory.forEach((cmd, index) => {
            this.printLine(`  ${(index + 1).toString().padStart(3)} ${cmd}`, 'text');
        });
    }

    showPwd() {
        this.printLine('/home/yangyang/terminal', 'text');
    }

    changeDirectory(dir) {
        if (!dir) {
            this.printLine('/home/yangyang/terminal', 'text');
        } else if (dir === '..') {
            this.printLine('cd: moved to /home/yangyang', 'info');
        } else if (dir === '~' || dir === '/') {
            this.printLine('cd: moved to /home/yangyang', 'info');
        } else {
            this.printLine(`cd: no such directory: ${dir}`, 'error');
        }
    }

    showCat(filename) {
        const files = {
            'readme.txt': 'Welcome to YangYang\'s Terminal!\n\nThis is an interactive terminal-style portfolio.\nType "help" to see available commands.\n\nEnjoy exploring! 🚀',
            'about.txt': 'Yang Yang (杨杨)\nComputer Technology MS Student\nSouth-Central Minzu University\nResearch: Multimodal Medical Image Analysis & Computer Vision',
            'contact.txt': 'Email: yangyang@mail.scuec.edu.cn\nLocation: Wuhan, China\nGitHub: github.com/Louaq'
        };

        if (!filename) {
            this.printLine('cat: missing file operand', 'error');
            this.printLine('Available files: ' + Object.keys(files).join(', '), 'info');
        } else if (files[filename]) {
            this.printLine(files[filename], 'text');
        } else {
            this.printLine(`cat: ${filename}: No such file`, 'error');
            this.printLine('Available files: ' + Object.keys(files).join(', '), 'info');
        }
    }

    showNeofetch() {
        const info = [
            '                   visitor@yangyang-terminal',
            '                   -------------------------',
            '    ██████         OS: YangYang Terminal v1.0.0',
            '    ██████         Host: GitHub Pages',
            '    ██████         Kernel: JavaScript ES6+',
            '    ██████         Uptime: ' + Math.floor(performance.now() / 1000) + ' seconds',
            '                   Shell: terminal.js',
            '                   Resolution: ' + window.innerWidth + 'x' + window.innerHeight,
            '                   Terminal: Web Browser',
            '                   CPU: Your Browser Engine',
            '                   Memory: Unlimited (Virtual)'
        ];
        info.forEach(line => {
            this.printLine(line, 'info');
        });
    }

    showTree() {
        const tree = [
            '.',
            '├── about/',
            '│   ├── education.txt',
            '│   ├── research.txt',
            '│   └── bio.txt',
            '├── projects/',
            '│   ├── rice-detection/',
            '│   └── texstudio/',
            '├── publications/',
            '│   ├── 2025-tvc.pdf',
            '│   └── 2024-cgi.pdf',
            '├── contact/',
            '│   ├── email.txt',
            '│   ├── github.txt',
            '│   └── scholar.txt',
            '└── readme.txt'
        ];
        tree.forEach(line => {
            this.printLine(line, 'text');
        });
    }

    showSkills() {
        this.printLine('Technical Skills:', 'info');
        this.printLine('');
        const skills = [
            { category: 'Deep Learning', items: 'PyTorch, TensorFlow, Keras, YOLO, Transformer' },
            { category: 'Computer Vision', items: 'OpenCV, PIL, Image Segmentation, Object Detection' },
            { category: 'Programming', items: 'Python, JavaScript, TypeScript, C++, Java, MATLAB' },
            { category: 'Web Development', items: 'HTML/CSS, React, Node.js, Electron' },
            { category: 'Tools & Others', items: 'Git, Docker, Linux, LaTeX, Jupyter' }
        ];

        skills.forEach(skill => {
            this.printLine(`  ${skill.category}:`, 'success');
            this.printLine(`    ${skill.items}`, 'text');
            this.printLine('', 'text');
        });
    }

    showQuote() {
        const quotes = [
            { text: 'The only way to do great work is to love what you do.', author: 'Steve Jobs' },
            { text: 'Innovation distinguishes between a leader and a follower.', author: 'Steve Jobs' },
            { text: 'Code is like humor. When you have to explain it, it\'s bad.', author: 'Cory House' },
            { text: 'First, solve the problem. Then, write the code.', author: 'John Johnson' },
            { text: 'Experience is the name everyone gives to their mistakes.', author: 'Oscar Wilde' },
            { text: 'The best way to predict the future is to invent it.', author: 'Alan Kay' },
            { text: 'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.', author: 'Martin Fowler' }
        ];

        const quote = quotes[Math.floor(Math.random() * quotes.length)];
        this.printLine(`"${quote.text}"`, 'text');
        this.printLine(`  - ${quote.author}`, 'info');
    }

    showWeather() {
        this.printLine('Weather in Wuhan, China:', 'info');
        this.printLine('');
        this.printLine('  🌤️  Partly Cloudy', 'text');
        this.printLine('  🌡️  Temperature: 18°C', 'text');
        this.printLine('  💧 Humidity: 65%', 'text');
        this.printLine('  🌬️  Wind: 12 km/h', 'text');
        this.printLine('', 'text');
        this.printLine('(Note: This is simulated data)', 'warning');
    }

    showPing(host) {
        if (!host) {
            this.printLine('ping: missing host operand', 'error');
            this.printLine('Usage: ping <host>', 'info');
            this.printLine('Example: ping google.com', 'info');
            return;
        }

        // 预定义的主机列表
        const knownHosts = {
            'google.com': '142.250.185.46',
            'github.com': '140.82.121.4',
            'localhost': '127.0.0.1',
            'yangyang.com': '192.168.1.100',
            'scuec.edu.cn': '202.114.96.1',
            'baidu.com': '110.242.68.66',
            'bilibili.com': '119.3.70.188',
            'zhihu.com': '103.41.167.234'
        };

        const ip = knownHosts[host.toLowerCase()] || this.generateRandomIP();

        this.printLine(`PING ${host} (${ip}): 56 data bytes`, 'info');
        this.printLine('', 'text');

        // 模拟 ping 4 次
        let successCount = 0;
        const pingResults = [];

        for (let i = 0; i < 4; i++) {
            const time = (Math.random() * 50 + 10).toFixed(1); // 10-60ms
            const ttl = Math.floor(Math.random() * 10) + 54; // 54-64
            const seq = i + 1;

            // 90% 成功率
            if (Math.random() > 0.1) {
                pingResults.push({
                    success: true,
                    seq: seq,
                    ttl: ttl,
                    time: time
                });
                successCount++;
            } else {
                pingResults.push({
                    success: false,
                    seq: seq
                });
            }
        }

        // 显示 ping 结果
        pingResults.forEach(result => {
            if (result.success) {
                this.printLine(
                    `64 bytes from ${ip}: icmp_seq=${result.seq} ttl=${result.ttl} time=${result.time} ms`,
                    'success'
                );
            } else {
                this.printLine(
                    `Request timeout for icmp_seq ${result.seq}`,
                    'error'
                );
            }
        });

        // 统计信息
        this.printLine('', 'text');
        this.printLine(`--- ${host} ping statistics ---`, 'info');

        const packetLoss = ((4 - successCount) / 4 * 100).toFixed(0);
        this.printLine(`4 packets transmitted, ${successCount} packets received, ${packetLoss}% packet loss`, 'text');

        if (successCount > 0) {
            const times = pingResults.filter(r => r.success).map(r => parseFloat(r.time));
            const min = Math.min(...times).toFixed(1);
            const max = Math.max(...times).toFixed(1);
            const avg = (times.reduce((a, b) => a + b, 0) / times.length).toFixed(1);

            this.printLine(`round-trip min/avg/max = ${min}/${avg}/${max} ms`, 'text');
        }
    }

    generateRandomIP() {
        return `${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`;
    }

    showSudo(command) {
        if (!command) {
            this.printLine('sudo: missing command', 'error');
            return;
        }

        const responses = [
            'Permission denied. Nice try! 😏',
            'sudo: you are not in the sudoers file. This incident will be reported.',
            'With great power comes great responsibility... but not for you! 🦸',
            'Access denied. You need to be root to run this command.',
            'sudo: are you sure you want to do that? (Just kidding, you can\'t!)'
        ];

        this.printLine(responses[Math.floor(Math.random() * responses.length)], 'error');
    }

    showFuck() {
        const responses = [
            {
                title: '🤬 What the fuck are you looking for?',
                messages: [
                    'Relax! This is just a terminal portfolio.',
                    'No need to get angry here! 😅',
                    '',
                    'Try these instead:',
                    '  • Type "help" to see all commands',
                    '  • Type "about" to know more about me',
                    '  • Type "projects" to see my cool projects',
                    '  • Type "quote" for some inspiration',
                    '',
                    'Or just keep typing "fuck" if it makes you feel better! 😏'
                ]
            },
            {
                title: '💩 Oh shit! You found the secret command!',
                messages: [
                    'Congratulations! You\'re a rebel! 🎉',
                    '',
                    'Here are some fun facts:',
                    '  • This command does absolutely nothing useful',
                    '  • But you can type it as many times as you want',
                    '  • It won\'t judge you (I will though 👀)',
                    '',
                    'Now go explore the real commands:',
                    '  → neofetch, tree, quote, weather, sudo, etc.',
                    '',
                    'Have fun! 🚀'
                ]
            },
            {
                title: '😤 Feeling frustrated?',
                messages: [
                    'I get it. Coding can be tough sometimes.',
                    '',
                    'Here\'s what you can do:',
                    '  1. Take a deep breath 🧘',
                    '  2. Type "quote" for motivation',
                    '  3. Check out my "projects" for inspiration',
                    '  4. Read my "publications" to see research work',
                    '  5. Or just type "clear" and start fresh',
                    '',
                    'Remember: Every expert was once a beginner! 💪',
                    '',
                    'P.S. You can also try "wtf" or "shit" 😈'
                ]
            },
            {
                title: '🎮 Easter Egg Unlocked!',
                messages: [
                    'You found one of the hidden commands!',
                    '',
                    'Achievement: Potty Mouth 🏆',
                    'Reward: Absolutely nothing! 😂',
                    '',
                    'But since you\'re here, let me share some secrets:',
                    '  • Try "sudo rm -rf /" (don\'t worry, it\'s safe)',
                    '  • Type "cat readme.txt" to read a file',
                    '  • Use "history" to see your command history',
                    '  • Press ↑/↓ arrows to navigate history',
                    '  • Press Tab for auto-completion',
                    '',
                    'Now you\'re a terminal pro! 🎓'
                ]
            },
            {
                title: '🤔 Interesting choice of words...',
                messages: [
                    'You know what? I respect the honesty! 😎',
                    '',
                    'Since we\'re being real here:',
                    '  • Yes, I\'m a CS student working on AI/CV',
                    '  • Yes, debugging is 90% of my life',
                    '  • Yes, I also curse at my code sometimes',
                    '  • No, this terminal won\'t curse back (much)',
                    '',
                    'Want to see something actually cool?',
                    '  → Type "neofetch" for system info',
                    '  → Type "tree" to see the file structure',
                    '  → Type "skills" to see what I can do',
                    '',
                    'Let\'s keep it professional... ish! 😉'
                ]
            }
        ];

        const response = responses[Math.floor(Math.random() * responses.length)];

        this.printLine('', 'text');
        this.printLine(response.title, 'warning');
        this.printLine('', 'text');

        response.messages.forEach(msg => {
            if (msg === '') {
                this.printLine('', 'text');
            } else if (msg.startsWith('  •') || msg.startsWith('  →') || msg.startsWith('  1.') || msg.startsWith('  2.') || msg.startsWith('  3.') || msg.startsWith('  4.') || msg.startsWith('  5.')) {
                this.printLine(msg, 'info');
            } else if (msg.includes('Achievement:') || msg.includes('Reward:')) {
                this.printLine(msg, 'success');
            } else {
                this.printLine(msg, 'text');
            }
        });

        this.printLine('', 'text');
    }

    scrollToBottom() {
        const terminalBody = document.getElementById('terminalBody');
        if (terminalBody) {
            terminalBody.scrollTop = terminalBody.scrollHeight;
        }
    }
}

// 初始化终端
(function() {
    // 确保 DOM 完全加载后再初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            window.terminal = new Terminal();
        });
    } else {
        // DOM 已经加载完成
        window.terminal = new Terminal();
    }
})();

