# AntiBot SDK Deployment Guide

## GitHub Repository Setup

1. **Create Repository**
   - Go to https://github.com/new
   - Repository name: `antibot-sdk`
   - Description: "A powerful JavaScript library for detecting and blocking bots"
   - Public repository
   - Don't initialize with README (we'll push our files)

2. **Upload Files**
   ```bash
   # Navigate to the SDK folder
   cd antibot-sdk
   
   # Initialize git repository
   git init
   
   # Add all files
   git add .
   
   # Commit changes
   git commit -m "Initial commit: AntiBot SDK v1.0.0"
   
   # Add remote origin
   git remote add origin https://github.com/med654/antibot-sdk.git
   
   # Push to GitHub
   git branch -M main
   git push -u origin main
   ```

3. **Create Release**
   - Go to your repository releases page
   - Click "Create a new release"
   - Tag version: `v1.0.0`
   - Release title: "AntiBot SDK v1.0.0"
   - Description: Copy from README.md
   - Publish release

## CDN Usage

Once deployed, users can use the SDK via:

```html
<script src="https://cdn.jsdelivr.net/gh/med654/antibot-sdk@v1.0.0/dist/antibot.min.js"></script>
```

## Version Management

For future updates:
1. Make changes to the code
2. Update version in `package.json`
3. Create new release with incremented version tag
4. Update CDN URLs in documentation

## Best Practices

- Keep releases stable
- Use semantic versioning (v1.0.0, v1.0.1, v1.1.0, etc.)
- Tag each release properly
- Update README with new features
- Test thoroughly before releasing