import SparkMD5 from 'spark-md5'

self.onmessage = function (e) {
  try{
      const { file, type } = e.data
  const spark = new SparkMD5.ArrayBuffer()
  const chunkSize = 1024 * 1024 * 2
  const reader = new FileReaderSync()
  if (type === 'FULL_FILE') {
    let index = 0
    let percent = 0
    while (index < file.size) {
      const chunk = file.slice(index, index + chunkSize)
      const arrayBuffer = reader.readAsArrayBuffer(chunk)
      spark.append(arrayBuffer)
      index += chunkSize
      percent = Math.round((index / file.size) * 100)
      self.postMessage({ type: 'PROGRESS', percent: percent })
    }

    const hash = spark.end()
    self.postMessage({ type: 'DONE', hash: hash, taskType: type })
  } else if (type === 'CHUNK') {
    const { chunk } = e.data
    const arrayBuffer = reader.readAsArrayBuffer(chunk)
    spark.append(arrayBuffer)
    const hash = spark.end()
    self.postMessage({ type: 'DONE', hash: hash, taskType: type })
  }
  }catch(error:any){
    self.postMessage({ type: 'ERROR', error: error.message })
  }
}
