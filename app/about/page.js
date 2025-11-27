'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'

export default function AboutPage() {
  return (
    <div className="bg-black min-h-screen">
      
      {/* HERO - Manifiesto */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        
        {/* Grid retro */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'linear-gradient(#8B5CF6 1px, transparent 1px), linear-gradient(90deg, #8B5CF6 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }} />

        {/* Glows */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

        {/* Esquinas decorativas */}
        <div className="absolute top-8 left-8 w-32 h-32 border-l-4 border-t-4 border-purple-500/30" />
        <div className="absolute bottom-8 right-8 w-32 h-32 border-r-4 border-b-4 border-pink-500/30" />

        <div className="relative z-10 container mx-auto px-6 py-24 text-center">
          
          {/* Badge superior */}
          <motion.div
            className="inline-block px-4 py-2 border-2 border-purple-500/50 text-purple-400 text-xs font-black tracking-widest mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            EST. 2024 - LIMA, PERÚ
          </motion.div>

          {/* Título gigante */}
          <motion.h1
            className="text-7xl md:text-9xl lg:text-[160px] font-black leading-none tracking-tighter mb-8"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <span className="block text-white drop-shadow-[0_0_40px_rgba(139,92,246,0.5)]">
              NO SOMOS
            </span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600 -mt-4">
              UNA MARCA
            </span>
          </motion.h1>

          {/* Subtítulo */}
          <motion.p
            className="text-white/70 text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed font-light"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Somos un <span className="text-purple-400 font-semibold">movimiento</span>. 
            Una comunidad de individuos que rechazan lo común y abrazan la exclusividad. 
            Cada pieza cuenta una historia. <span className="text-pink-400 font-semibold">Tu historia</span>.
          </motion.p>

          {/* Número decorativo gigante */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[280px] md:text-[400px] font-black text-purple-500/5 pointer-events-none select-none leading-none -z-10">
            999
          </div>
        </div>
      </section>

      {/* MANIFESTO - Cards */}
      <section className="py-24 px-6 bg-zinc-950 relative">
        
        <div className="container mx-auto max-w-6xl">
          
          {/* Header */}
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl md:text-7xl font-black text-white mb-6">
              NUESTRO
              <span className="block text-purple-400">MANIFIESTO</span>
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto" />
          </motion.div>

          {/* Grid de principios */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {[
              {
                number: '01',
                title: 'LIMITADO',
                desc: 'Cada drop tiene exactamente 999 unidades. Cuando se acaba, se acaba para siempre. Sin restock, sin excepciones.'
              },
              {
                number: '02',
                title: 'AUTÉNTICO',
                desc: 'Cada pieza es verificable. No producimos en masa. No seguimos tendencias. Creamos la cultura que otros copiarán.'
              },
              {
                number: '03',
                title: 'REBELDE',
                desc: 'No estamos aquí para complacer a todos. Diseñamos para los que se atreven a ser diferentes, los outsiders, los creadores.'
              }
            ].map((item, i) => (
              <motion.div
                key={i}
                className="group relative bg-black border-2 border-purple-500/20 p-8 hover:border-purple-500 transition-all"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                whileHover={{ y: -10 }}
              >
                {/* Glow en hover */}
                <div className="absolute inset-0 bg-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                
                {/* Número decorativo */}
                <div className="text-8xl font-black text-purple-500/10 absolute top-4 right-4 leading-none">
                  {item.number}
                </div>

                <div className="relative z-10">
                  <h3 className="text-2xl font-black text-white mb-4 tracking-wider">
                    {item.title}
                  </h3>
                  <div className="w-12 h-[2px] bg-purple-500 mb-6" />
                  <p className="text-white/60 text-sm leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* STORY - Timeline visual */}
      <section className="py-24 px-6 bg-black relative overflow-hidden">
        
        {/* Línea vertical decorativa */}
        <div className="absolute left-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-purple-500/50 via-pink-500/50 to-purple-500/50" />

        <div className="container mx-auto max-w-4xl">
          
          <motion.h2
            className="text-5xl md:text-7xl font-black text-white text-center mb-20"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            LA <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">HISTORIA</span>
          </motion.h2>

          {/* Timeline items */}
          <div className="space-y-24">
            {[
              {
                year: '2024',
                title: 'EL INICIO',
                desc: 'Nace ZORU en Lima. Una idea loca de crear streetwear que realmente signifique algo. Sin inversores, sin compromisos.',
                align: 'left'
              },
              {
                year: '2024',
                title: 'PRIMER DROP',
                desc: 'Lanzamos nuestra primera colección de 999 hoodies. Se agotó en 48 horas. La comunidad empezó a crecer.',
                align: 'right'
              },
              {
                year: '2025',
                title: 'AHORA',
                desc: 'Seguimos creciendo orgánicamente. Cada drop cuenta una historia. Cada cliente es parte del movimiento.',
                align: 'left'
              }
            ].map((item, i) => (
              <motion.div
                key={i}
                className={`relative flex items-center ${item.align === 'right' ? 'flex-row-reverse' : ''}`}
                initial={{ opacity: 0, x: item.align === 'right' ? 50 : -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
              >
                {/* Punto en la línea */}
                <div className="absolute left-1/2 -translate-x-1/2 w-6 h-6 bg-purple-500 border-4 border-black rounded-full z-10" />

                {/* Contenido */}
                <div className={`w-5/12 ${item.align === 'right' ? 'text-right' : ''}`}>
                  <div className="bg-zinc-950 border-2 border-purple-500/20 p-6 hover:border-purple-500 transition-colors group">
                    <div className="text-purple-400 font-black text-sm tracking-widest mb-2">
                      {item.year}
                    </div>
                    <h3 className="text-2xl font-black text-white mb-3">
                      {item.title}
                    </h3>
                    <p className="text-white/60 text-sm leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CREW - Team placeholder */}
      <section className="py-24 px-6 bg-zinc-950 relative">
        
        <div className="container mx-auto max-w-6xl">
          
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl md:text-7xl font-black text-white mb-4">
              EL <span className="text-purple-400">CREW</span>
            </h2>
            <p className="text-white/60 text-lg">
              Los locos detrás de ZORU
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { role: 'CREATIVE', name: 'Los Visionarios', desc: 'Diseñamos cada pieza con obsesión por el detalle' },
              { role: 'COMMUNITY', name: 'Los Conectores', desc: 'Construimos la familia ZORU día a día' },
              { role: 'OPERATIONS', name: 'Los Ejecutores', desc: 'Hacemos que cada drop sea perfecto' }
            ].map((member, i) => (
              <motion.div
                key={i}
                className="group relative"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                {/* Avatar placeholder con gradient */}
                <div className="aspect-square bg-gradient-to-br from-purple-600/20 to-pink-600/20 mb-6 flex items-center justify-center border-2 border-purple-500/30 group-hover:border-purple-500 transition-all relative overflow-hidden">
                  <div className="text-6xl font-black text-purple-500/20">
                    {member.role.charAt(0)}
                  </div>
                  
                  {/* Scan effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                </div>

                <div className="text-purple-400 text-xs font-black tracking-widest mb-2">
                  {member.role}
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  {member.name}
                </h3>
                <p className="text-white/50 text-sm">
                  {member.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="py-32 px-6 bg-black relative overflow-hidden">
        
        {/* Efectos de luz */}
        <div className="absolute inset-0 bg-gradient-to-t from-purple-900/20 to-transparent" />
        
        <div className="container mx-auto max-w-4xl text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-6xl md:text-8xl font-black text-white mb-8 leading-none">
              <span className="block">ÚNETE A</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600">
                LA REVOLUCIÓN
              </span>
            </h2>

            <p className="text-white/60 text-xl mb-12 max-w-2xl mx-auto">
              No vendemos ropa. Vendemos identidad. Vendemos pertenencia. 
              Vendemos la oportunidad de ser parte de algo más grande.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/tienda">
                <motion.button
                  className="px-10 py-5 bg-purple-600 hover:bg-purple-700 text-white font-black text-lg tracking-wider transition-colors relative overflow-hidden group"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                  <span className="relative z-10">VER DROPS</span>
                </motion.button>
              </Link>

              <Link href="/raffle">
                <motion.button
                  className="px-10 py-5 border-2 border-white/20 hover:border-purple-500 text-white font-black text-lg tracking-wider transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  ENTRAR AL RAFFLE
                </motion.button>
              </Link>
            </div>

            {/* Stats decorativos */}
            <div className="grid grid-cols-3 gap-8 mt-20 max-w-2xl mx-auto">
              {[
                { num: '999', label: 'PIEZAS POR DROP' },
                { num: '24H', label: 'ENTREGAS LIMA' },
                { num: '100%', label: 'AUTÉNTICO' }
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  className="border-l-2 border-purple-500/30 pl-4 text-left"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <div className="text-4xl font-black text-purple-400">
                    {stat.num}
                  </div>
                  <div className="text-xs text-white/40 tracking-wider mt-1">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  )
}
