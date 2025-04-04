module.export = {
  apps: [
    {
      name: 'rental-app',
      script: 'npm',
      args: "run dev",
      env: {
        NODE_ENV: 'development',
      },
    },
  ],
}