import { spawnSync } from "child_process";
import { readdirSync } from "fs";
import { join, extname, basename } from "path";
import { Configuration, DefinePlugin } from "webpack";
import { compilerOptions } from "./tsconfig.json";

const { env, argv } = process
const { NODE_ENV = 'development' } = env

const isDevMode = NODE_ENV != 'production'
const isServeMode = argv.indexOf('serve') != -1
const getGitUrl = () => {
  const {stdout} = spawnSync('git', ['remote', 'get-url', 'origin'])
  const [,output] = `${stdout}`.split('@')
  return `https://${output.replace(':', '/').replace('.git', '')}`.trim()
}

const getAliases = () => {
  const output: {[key: string]: string} = {}
  const baseUrl = compilerOptions?.['baseUrl'] || ''

  if(!baseUrl)
    return output

  const regExp = /\.m?(js|ts)x?$/
  const path = join(__dirname, baseUrl)

  for(let file of readdirSync(path)) {
    const fullPath = join(path, file)
    
    if(!regExp.test(file)) {
      output[file] = fullPath
      continue
    }

    const ext = extname(file)
    const baseName = basename(file, ext)
    output[baseName] = fullPath
  }

  return output
}

module.exports = {
  entry: {
    'index': './index.tsx'
  },
  output: {
    path: join(__dirname, 'dist'),
    publicPath: (isServeMode ? '/' : '') + 'dist/'
  },
  externals: {
    'react': 'React',
    'react-dom': 'ReactDOM'
  },
  resolve: {
    alias: getAliases(),
    extensions: ['.js', '.jsx', '.mjs', '.json', '.ts', '.tsx'] 
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader'
      },
      {
        test: /\.s(a|c)ss$/,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'sass-loader',
            options: { webpackImporter: false }
          }
        ]
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      }
    ]
  },
  mode: isDevMode ? 'development' : 'production',
  watch: isDevMode && !isServeMode,
  devtool: isDevMode ? 'inline-source-map' : false,
  plugins: [
    new DefinePlugin({
      DEVMODE: `${isDevMode}`,
      GITGUB: `() => window.open('${getGitUrl()}')`
    })
  ]
} as Configuration