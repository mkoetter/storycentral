# Version Control & Deployment

## GitHub Workflow
- All code changes must be committed to GitHub
- Use clear, descriptive commit messages
- Always check current branch before making changes
- Push changes after successful local testing

## Vercel Auto-Deployment
- The main/master branch is connected to Vercel for automatic deployment
- Every push to main triggers a production deployment
- Feature branches create preview deployments automatically
- Never push directly to main without testing
- Verify deployment status after pushing

## Branch Testing Workflow
When asked to implement and test a feature using a subagent:
1. Create a new feature branch: `git checkout -b feature/[name]`
2. Launch a subagent to implement the feature on this branch
3. Have the subagent run the full test suite: `npm test`
4. If all tests pass:
   - Commit changes with descriptive message
   - Push branch to GitHub
   - Create a pull request to main
   - Provide PR link for review
5. If tests fail:
   - Debug and fix issues
   - Re-run tests until passing
   - Do not merge failing code

Use subagents for isolated feature work to preserve main conversation context.

# Tech Stack
- Framework: Next.js 14
- Database: MongoDB
- Language: TypeScript
- Hosting: Vercel

# Project Structure
- `src/app`: Next.js App Router pages
- `src/components`: React components
- `src/lib`: Utilities and API clients

# Commands
- `npm run dev`: Start dev server
- `npm run build`: Build for production
- `npm test`: Run tests

# Code Style
- Use ES modules (import/export)
- Follow TypeScript strict mode
- Use 2-space indentation
- Add JSDoc comments to functions

# File Boundaries
- Safe to edit: /src/, /tests/
- Never touch: /node_modules/, /.next/

# Rules
- Always write tests for new features
- Use Server Components by default
- Handle errors with try-catch